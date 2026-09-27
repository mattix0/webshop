import os
from dotenv import load_dotenv


load_dotenv()


# Database
DATABASE_TYPE = os.environ['DATABASE_TYPE']
DATABASE_USER = os.environ['DATABASE_USER']
DATABASE_PASSWORD = os.environ['DATABASE_PASSWORD']
DATABASE_HOST = os.environ['DATABASE_HOST']
DATABASE_PORT = os.environ['DATABASE_PORT']
DATABASE_DB = os.environ['DATABASE_DB']


# JWT
JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']
ALGORITHM = "HS256"