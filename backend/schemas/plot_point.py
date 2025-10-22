from pydantic import BaseModel

class PlotPointResponse(BaseModel):
    title: str 
    content: str 
    relevance: int