import datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Award(Base):
    __tablename__ = "awards"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    competition: Mapped[str] = mapped_column(String(200))
    winners: Mapped[str] = mapped_column(String(200))
    awarded_on: Mapped[datetime.date] = mapped_column(Date)
    description: Mapped[str] = mapped_column(Text, default="")


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    student_id: Mapped[str] = mapped_column(String(20))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(120))
    motivation: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(50))
    student_id: Mapped[str] = mapped_column(String(20))
    role: Mapped[str] = mapped_column(String(10), default="member")  # member | admin
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    board: Mapped[str] = mapped_column(String(20), index=True)  # notice | question | resource
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    author: Mapped["User"] = relationship()
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )
    attachments: Mapped[list["Attachment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    author: Mapped["User"] = relationship()
    post: Mapped["Post"] = relationship(back_populates="comments")


class Attachment(Base):
    __tablename__ = "attachments"

    id: Mapped[int] = mapped_column(primary_key=True)
    filename: Mapped[str] = mapped_column(String(255))  # 사용자가 올린 원본 파일명
    stored_name: Mapped[str] = mapped_column(String(255))  # 서버에 저장된 파일명
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))

    post: Mapped["Post"] = relationship(back_populates="attachments")


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True)
    kind: Mapped[str] = mapped_column(String(10))  # study | group | mt
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text, default="")
    semester: Mapped[str] = mapped_column(String(20))  # 예: "2026-1"
