"""비밀번호 해시와 JWT 토큰, 로그인 의존성 함수 모음."""
import datetime

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app import config
from app.database import get_db
from app.models import User

ALGORITHM = "HS256"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(hours=config.TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, config.SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """쿠키의 access_token을 검사해 현재 로그인한 사용자를 돌려준다."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다")
    return user


def get_approved_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_approved:
        raise HTTPException(status_code=403, detail="운영진 승인 대기 중입니다")
    return user


def get_admin_user(user: User = Depends(get_approved_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="운영진만 가능합니다")
    return user
