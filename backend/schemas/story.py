from datetime import datetime
from pydantic import BaseModel

class StoryResponse(BaseModel):
    id: int 
    title: str 
    context: str 
    session_id: str 
    created_at: datetime 