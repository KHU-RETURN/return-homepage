from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app import config
from app.auth import (
    create_access_token,
    get_approved_user,
    get_current_user,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models import Post, User
from app.routers.posts import to_post_list_item
from app.schemas import LoginIn, PostListItem, SignupIn, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut, status_code=201)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.username == payload.username).first()
    if exists:
        raise HTTPException(status_code=409, detail="이미 사용 중인 아이디입니다")

    user = User(
        username=payload.username,
        password_hash=hash_password(payload.password),
        name=payload.name,
        student_id=payload.student_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=UserOut)
def login(payload: LoginIn, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다"
        )
    if not user.is_approved:
        raise HTTPException(status_code=403, detail="운영진 승인 대기 중입니다")

    token = create_access_token(user.id)
    response.set_cookie(
        "access_token",
        token,
        httponly=True,
        samesite="lax",
        max_age=config.TOKEN_EXPIRE_HOURS * 3600,
    )
    return user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    # 미승인 회원도 자기 승인 상태를 확인할 수 있어야 한다
    return user


@router.get("/me/posts", response_model=list[PostListItem])
def my_posts(
    user: User = Depends(get_approved_user), db: Session = Depends(get_db)
):
    posts = (
        db.query(Post)
        .filter(Post.author_id == user.id)
        .order_by(Post.id.desc())
        .all()
    )
    return [to_post_list_item(post) for post in posts]
