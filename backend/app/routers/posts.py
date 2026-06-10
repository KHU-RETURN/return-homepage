import os
import uuid
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import config
from app.auth import get_approved_user, get_current_user
from app.database import get_db
from app.models import Attachment, Comment, Post, User
from app.schemas import (
    AttachmentOut,
    CommentCreate,
    CommentOut,
    PostCreate,
    PostDetail,
    PostListItem,
    PostUpdate,
)

router = APIRouter(prefix="/api", tags=["posts"])

Board = Literal["notice", "question", "resource"]

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


# ----- 응답 dict 만드는 도우미 (author_name을 relationship에서 꺼낸다) -----

def to_post_list_item(post: Post) -> dict:
    return {
        "id": post.id,
        "board": post.board,
        "title": post.title,
        "author_name": post.author.name,
        "created_at": post.created_at,
        "comment_count": len(post.comments),
    }


def to_comment_out(comment: Comment) -> dict:
    return {
        "id": comment.id,
        "content": comment.content,
        "author_id": comment.author_id,
        "author_name": comment.author.name,
        "created_at": comment.created_at,
    }


def to_post_detail(post: Post) -> dict:
    return {
        "id": post.id,
        "board": post.board,
        "title": post.title,
        "content": post.content,
        "author_id": post.author_id,
        "author_name": post.author.name,
        "created_at": post.created_at,
        "comments": [to_comment_out(c) for c in post.comments],
        "attachments": post.attachments,
    }


def check_board_access(board: str, request: Request, db: Session):
    """notice는 누구나, 나머지 게시판은 승인된 회원만 볼 수 있다."""
    if board == "notice":
        return
    user = get_current_user(request, db)
    if not user.is_approved:
        raise HTTPException(status_code=403, detail="운영진 승인 대기 중입니다")


def get_post_or_404(post_id: int, db: Session) -> Post:
    post = db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="글을 찾을 수 없습니다")
    return post


def check_author_or_admin(post_or_comment, user: User):
    if post_or_comment.author_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="권한이 없습니다")


# ----- 게시글 -----

@router.get("/posts", response_model=list[PostListItem])
def list_posts(board: Board, request: Request, db: Session = Depends(get_db)):
    check_board_access(board, request, db)
    posts = (
        db.query(Post).filter(Post.board == board).order_by(Post.id.desc()).all()
    )
    return [to_post_list_item(post) for post in posts]


@router.get("/posts/{post_id}", response_model=PostDetail)
def get_post(post_id: int, request: Request, db: Session = Depends(get_db)):
    post = get_post_or_404(post_id, db)
    check_board_access(post.board, request, db)
    return to_post_detail(post)


@router.post("/posts", response_model=PostDetail, status_code=201)
def create_post(
    payload: PostCreate,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    if payload.board not in ("notice", "question", "resource"):
        raise HTTPException(status_code=400, detail="없는 게시판입니다")
    if payload.board == "notice" and user.role != "admin":
        raise HTTPException(status_code=403, detail="운영진만 가능합니다")

    post = Post(
        board=payload.board,
        title=payload.title,
        content=payload.content,
        author_id=user.id,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return to_post_detail(post)


@router.put("/posts/{post_id}", response_model=PostDetail)
def update_post(
    post_id: int,
    payload: PostUpdate,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    post = get_post_or_404(post_id, db)
    check_author_or_admin(post, user)
    post.title = payload.title
    post.content = payload.content
    db.commit()
    db.refresh(post)
    return to_post_detail(post)


@router.delete("/posts/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    post = get_post_or_404(post_id, db)
    check_author_or_admin(post, user)

    # 첨부파일은 DB 레코드뿐 아니라 실제 파일도 지운다
    for attachment in post.attachments:
        path = Path(config.UPLOAD_DIR) / attachment.stored_name
        if path.is_file():
            os.remove(path)

    db.delete(post)
    db.commit()


# ----- 댓글 -----

@router.post("/posts/{post_id}/comments", response_model=CommentOut, status_code=201)
def create_comment(
    post_id: int,
    payload: CommentCreate,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    get_post_or_404(post_id, db)
    comment = Comment(content=payload.content, author_id=user.id, post_id=post_id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return to_comment_out(comment)


@router.delete("/comments/{comment_id}", status_code=204)
def delete_comment(
    comment_id: int,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    comment = db.get(Comment, comment_id)
    if comment is None:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다")
    check_author_or_admin(comment, user)
    db.delete(comment)
    db.commit()


# ----- 첨부파일 -----

@router.post("/posts/{post_id}/files", response_model=AttachmentOut, status_code=201)
def upload_file(
    post_id: int,
    file: UploadFile,
    user: User = Depends(get_approved_user),
    db: Session = Depends(get_db),
):
    post = get_post_or_404(post_id, db)
    if post.author_id != user.id:
        raise HTTPException(status_code=403, detail="글 작성자만 올릴 수 있습니다")

    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="파일은 10MB 이하만 가능합니다")

    upload_dir = Path(config.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename or "").suffix
    stored_name = uuid.uuid4().hex + ext
    (upload_dir / stored_name).write_bytes(content)

    attachment = Attachment(
        filename=file.filename or "file", stored_name=stored_name, post_id=post_id
    )
    db.add(attachment)
    db.commit()
    db.refresh(attachment)
    return attachment


@router.get("/files/{attachment_id}")
def download_file(
    attachment_id: int, request: Request, db: Session = Depends(get_db)
):
    attachment = db.get(Attachment, attachment_id)
    if attachment is None:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")

    check_board_access(attachment.post.board, request, db)

    path = Path(config.UPLOAD_DIR) / attachment.stored_name
    if not path.is_file():
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다")
    return FileResponse(path, filename=attachment.filename)
