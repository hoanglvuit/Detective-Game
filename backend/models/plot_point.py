from sqlalchemy import Column, String

from db.base import BaseModel


class PlotPoint(BaseModel):
    __tablename__ = "plot_point" 
    story_id = Column(String, nullable=False) # Không dùng foreign key vì đỡ phức tạp
    title = Column(String, nullable=False)
    content = Column(String, nullable=False) 
    relevance = Column(String, nullable=False)