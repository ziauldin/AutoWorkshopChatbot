import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import SQLAlchemyError

# Load environment variables
load_dotenv()

# Read the full DB connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:admin@localhost:5432/auto_chatbot_db"
)

try:
    engine = create_engine(DATABASE_URL, echo=False)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    print("✅ Connected to Railway PostgreSQL database")
except SQLAlchemyError as e:
    print(f"❌ Database connection error: {e}")
