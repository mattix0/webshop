from helper import (DATABASE_TYPE, DATABASE_USER, DATABASE_PASSWORD, 
                   DATABASE_HOST, DATABASE_PORT, DATABASE_DB)
from sqlmodel import create_engine, Session, SQLModel
from typing import Annotated
from fastapi import Depends

DATABASE_URL = (
    f"{DATABASE_TYPE}{DATABASE_USER}:{DATABASE_PASSWORD}"
    f"@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_DB}")

#args = {"check_same_thread": False} # issues with pscogpy2 
#https://docs.sqlalchemy.org/en/20/errors.html#error-f405
#engine = create_engine(DATABASE_URL, connect_args=args)
engine = create_engine(DATABASE_URL)

def db_session():
    with Session(engine) as session:
        yield session

SessionDepends = Annotated[Session, Depends(db_session)]

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)