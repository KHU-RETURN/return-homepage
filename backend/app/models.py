import datetime

from sqlalchemy import Date, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

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
