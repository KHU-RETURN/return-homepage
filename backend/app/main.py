from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.admin import mount_admin
from app.database import Base, engine
from app.routers import applications, awards


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="RETURN Homepage API", lifespan=lifespan)

app.include_router(awards.router)
app.include_router(applications.router)

mount_admin(app, engine)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
