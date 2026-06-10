from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.admin import mount_admin
from app.database import Base, engine
from app.routers import activities, applications, auth, awards, posts


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(title="RETURN Homepage API", lifespan=lifespan)

app.include_router(awards.router)
app.include_router(applications.router)
app.include_router(auth.router)
app.include_router(activities.router)
app.include_router(posts.router)

mount_admin(app, engine)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


from pathlib import Path

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_spa(full_path: str):
        candidate = DIST_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(DIST_DIR / "index.html")
