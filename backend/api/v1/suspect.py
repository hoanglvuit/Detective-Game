from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from db.session import get_db
from schemas.suspect import SuspectResponse
from models.suspect import Suspect
from typing import List

router = APIRouter(prefix="/suspect", tags=["suspect"]) 

@router.get("/{story_id}", response_model=List[SuspectResponse])
def get_suspect(story_id: int, db: Session = Depends(get_db)):
    suspects = db.query(Suspect).filter(Suspect.story_id == story_id).all()
    if not suspects:
        raise HTTPException(status_code=404, detail="Suspects not found")
    return suspects