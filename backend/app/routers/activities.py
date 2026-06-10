from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Activity
from app.schemas import ActivityOut

router = APIRouter(prefix="/api/activities", tags=["activities"])


@router.get("", response_model=list[ActivityOut])
def list_activities(db: Session = Depends(get_db)):
    return db.query(Activity).order_by(Activity.kind, Activity.id).all()
