from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func

from db.base import BaseModel


class Job(BaseModel):
    __tablename__ = "job"
    story_id = Column(String, nullable=False) # Không dùng foreign key vì đỡ phức tạp
    session_id = Column(String, nullable=False) 
    topic = Column(String, nullable=False)
    status = Column(String, nullable=False) 
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now()) 
    completed_at = Column(DateTime(timezone=True), nullable=True)
    total_tokens = Column(Integer, nullable=True)