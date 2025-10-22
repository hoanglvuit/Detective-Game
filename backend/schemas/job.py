from typing import Optional
from pydantic import BaseModel

class JobCreateRequest(BaseModel): 
    topic: str

class JobResponse(BaseModel): 
    id: int
    session_id: str
    story_id: Optional[int] = None
    status: str
    error_message: Optional[str] = None

    class Config: 
        from_attributes = True