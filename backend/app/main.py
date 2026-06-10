from fastapi import FastAPI

app = FastAPI(title="RETURN Homepage API")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
