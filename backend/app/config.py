import os

ADMIN_USERNAME = os.getenv("RETURN_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("RETURN_ADMIN_PASSWORD", "changeme")
SECRET_KEY = os.getenv("RETURN_SECRET_KEY", "dev-secret-key-do-not-use-in-prod")
DATABASE_URL = os.getenv("RETURN_DATABASE_URL", "sqlite:///./return.db")
