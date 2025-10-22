from typing import Optional
from pydantic import BaseModel

class JobCreateRequest(BaseModel): 
    topic: str

class JobResponse(BaseModel): 
    job_id: int
    status: str
    error: Optional[str] = None

    class Config: 
        from_attributes = True