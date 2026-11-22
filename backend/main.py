from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import auth, admin, public, uploads
from database import create_db_and_tables
from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173",
                   "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


UPLOAD_ROOT = Path(__file__).resolve().parent / "uploads"
UPLOAD_ROOT.mkdir(exist_ok=True)


app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(public.router)
app.include_router(uploads.router)


app.mount("/api/v1/uploads", StaticFiles(directory=UPLOAD_ROOT), name="uploads")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()