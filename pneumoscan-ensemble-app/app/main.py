"""FastAPI entry point for the PneumoScan web application."""
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError

from .inference import EnsemblePredictor


MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
ROOT = Path(__file__).resolve().parent.parent
STATIC_DIR = ROOT / "static" if (ROOT / "static").exists() else ROOT / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.predictor = EnsemblePredictor()
    yield


app = FastAPI(title="PneumoScan AI", version="1.0.0", lifespan=lifespan)


@app.get("/api/health")
def health():
    return {"status": "ok", "models": ["densenet121", "efficientnet_b3", "swin_tiny"]}


@app.post("/api/predict")
async def predict(image: UploadFile = File(...)):
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, JPEG, or PNG image.")

    contents = await image.read(MAX_UPLOAD_BYTES + 1)
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="The image must be 10 MB or smaller.")

    try:
        with Image.open(BytesIO(contents)) as uploaded:
            uploaded.load()
            xray = uploaded.copy()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    return app.state.predictor.predict(xray)


if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="frontend")
