from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer
from core.config import settings
from sqlalchemy import create_engine


engine = create_engine(settings.DATABASE_URL)
Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True 
    id = Column(Integer, primary_key=True, index=True)

def create_tables():
    BaseModel.metadata.create_all(bind=engine)
