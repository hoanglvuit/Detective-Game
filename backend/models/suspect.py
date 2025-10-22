from sqlalchemy import Column, String, Integer, Boolean

from db.base import BaseModel


class Suspect(BaseModel):
    __tablename__ = "suspect"
    story_id = Column(String, nullable=False) # Không dùng foreign key vì đỡ phức tạp
    name = Column(String, nullable=False) 
    description = Column(String, nullable=False)
    sex = Column(String) 
    age = Column(Integer)
    job = Column(String) 
    situation = Column(String) 
    is_killer = Column(Boolean, default=False) 
    explanation = Column(String, nullable=False)