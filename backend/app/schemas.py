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
