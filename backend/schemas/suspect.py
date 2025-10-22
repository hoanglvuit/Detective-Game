from typing import Optional
from pydantic import BaseModel

class SuspectResponse(BaseModel):
    name: str 
    description: str 
    sex: Optional[str] = None 
    age: Optional[int] = None 
    job: Optional[str] = None 
    situation: Optional[str] = None 
    is_killer: bool 
    explanation: str 
