from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session

from db.base import get_db
from schemas.job import JobCreateRequest, JobResponse
from models.job import Job

router = APIRouter(prefix="/job", tags=["job"]) 

@router.post("/create", response_model=JobResponse) 
def create_job(
    request: JobCreateRequest,
    background_tasks: BackgroundTasks, # to run llm in background task 
    response: Response, #to set cookie 
    session_id: str = Cookie(None),  
    db: Session = Depends(get_db)
): 
    response.set_cookie(key="session_id", value=session_id, httponly=True) 

    job_id 


@router.get("/{job_id}", response_model=JobResponse) 
def get_job(job_id: int, db: Session = Depends(get_db)): 
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job: 
        HTTPException(status_code=404, detail="Job not found")
    return job