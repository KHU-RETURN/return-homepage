import os

# 개발 환경 기본값. 프로덕션 배포 전 반드시 환경변수로 교체할 것.
# docs/운영가이드.md "최초 서버 설정" 섹션 참고.
ADMIN_USERNAME = os.getenv("RETURN_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("RETURN_ADMIN_PASSWORD", "changeme")
SECRET_KEY = os.getenv("RETURN_SECRET_KEY", "dev-secret-key-do-not-use-in-prod")
DATABASE_URL = os.getenv("RETURN_DATABASE_URL", "sqlite:///./return.db")
TOKEN_EXPIRE_HOURS = int(os.getenv("RETURN_TOKEN_EXPIRE_HOURS", "24"))
UPLOAD_DIR = os.getenv("RETURN_UPLOAD_DIR", "uploads")
