import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables
load_dotenv()

# Use Railway PostgreSQL connection URL directly from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Raise an error if DATABASE_URL is not set
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not set in environment variables.")

# Set up SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

print("✅ Connected to Railway PostgreSQL database")
