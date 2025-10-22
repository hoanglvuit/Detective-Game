from typing import Optional, List
from pydantic import BaseModel

class SuspectLLMResponse(BaseModel):
    name: str
    description: str
    sex: Optional[str] = None
    age: Optional[int] = None
    job: Optional[str] = None
    situation: Optional[str] = None
    is_killer: bool
    explanation: str

class PlotPointLLMResponse(BaseModel):
    title: str
    content: str
    relevance: int

class StoryLLMResponse(BaseModel):
    title: str 
    context: str 
    plot_points: List[PlotPointLLMResponse]
    suspects: List[SuspectLLMResponse]