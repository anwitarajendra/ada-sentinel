from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
# ... other imports ...

# This tells Python exactly where to find the .env file relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

# This check prevents the 'got None' error by giving a helpful message instead
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL not found. Check if your .env file exists in risk_service/")

engine = create_engine(DATABASE_URL)
# ... rest of your code ...

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()