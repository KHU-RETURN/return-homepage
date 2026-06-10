from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="RETURN Homepage API", lifespan=lifespan)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
