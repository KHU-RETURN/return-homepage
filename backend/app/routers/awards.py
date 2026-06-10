from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Award
from app.schemas import AwardOut

router = APIRouter(prefix="/api/awards", tags=["awards"])


@router.get("", response_model=list[AwardOut])
def list_awards(db: Session = Depends(get_db)):
    return db.query(Award).order_by(Award.awarded_on.desc()).all()
