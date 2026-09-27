from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, admin
from database import create_db_and_tables


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173",
                   "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth.router)
app.include_router(admin.router)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()