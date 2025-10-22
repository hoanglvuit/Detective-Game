from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from db.session import get_db
from schemas.plot_point import PlotPointResponse
from models.plot_point import PlotPoint
from typing import List


router = APIRouter(prefix="/plot_point", tags=["plot_point"]) 

@router.get("/{story_id}", response_model=List[PlotPointResponse])
def get_plot_point(story_id: int, db: Session = Depends(get_db)):
    plot_points = db.query(PlotPoint).filter(PlotPoint.story_id == story_id).all()  
    if not plot_points:
        raise HTTPException(status_code=404, detail="Plot points not found")
    return plot_points