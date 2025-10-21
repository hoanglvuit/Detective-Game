from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func

from db.base import BaseModel


class Story(BaseModel):
    __tablename__ = "story"
    title = Column(String, nullable=False)
    context = Column(String, nullable=False)
    explanation = Column(String, nullable=False)
    session_id = Column(String)
    created_at = Column(DateTime(timezone=True), default=func.now())