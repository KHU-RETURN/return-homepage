import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AwardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    competition: str
    winners: str
    awarded_on: datetime.date
    description: str


class ApplicationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    student_id: str = Field(min_length=8, max_length=20)
    phone: str = Field(min_length=9, max_length=20)
    email: EmailStr
    motivation: str = Field(min_length=10, max_length=2000)


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


# ----- 회원 -----

class SignupIn(BaseModel):
    username: str = Field(min_length=4, max_length=50)
    password: str = Field(min_length=8, max_length=100)
    name: str = Field(min_length=1, max_length=50)
    student_id: str = Field(min_length=8, max_length=20)


class LoginIn(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    name: str
    student_id: str
    role: str
    is_approved: bool


# ----- 게시판 -----

class PostCreate(BaseModel):
    board: str
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1, max_length=20000)


class PostUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1, max_length=20000)


class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


class CommentOut(BaseModel):
    id: int
    content: str
    author_id: int
    author_name: str
    created_at: datetime.datetime


class AttachmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str


class PostListItem(BaseModel):
    id: int
    board: str
    title: str
    author_name: str
    created_at: datetime.datetime
    comment_count: int


class PostDetail(BaseModel):
    id: int
    board: str
    title: str
    content: str
    author_id: int
    author_name: str
    created_at: datetime.datetime
    comments: list[CommentOut]
    attachments: list[AttachmentOut]


# ----- 활동 -----

class ActivityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    kind: str
    title: str
    description: str
    semester: str
