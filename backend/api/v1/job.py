from fastapi import APIRouter, Depends, HTTPException, Cookie, BackgroundTasks, Response
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from db.session import SessionLocal
from db.session import get_db
from schemas.job import JobCreateRequest, JobResponse
from models.job import Job
import uuid
from core.story_generator import StoryGenerator

router = APIRouter(prefix="/job", tags=["job"]) 

def get_session_id(session_id: str = Cookie(None)) -> str:
    if not session_id: 
        session_id = str(uuid.uuid4())
    return session_id

@router.post("/create", response_model=JobResponse) 
def create_job(
    request: JobCreateRequest,
    background_tasks: BackgroundTasks, # to run llm in background task 
    response: Response, #to set cookie 
    session_id: str = Depends(get_session_id),  
    db: Session = Depends(get_db)
): 
    response.set_cookie(key="session_id", value=session_id, httponly=True) 

    job = Job(
        session_id=session_id,
        topic=request.topic,
        status="pending",
        error_message=None,
        created_at=datetime.now(timezone.utc),
        completed_at=None,
        total_tokens=None
    )
    db.add(job)
    db.commit() 

    

    background_tasks.add_task(generate_story, job.id, session_id)
    return job


def generate_story(job_id: int, session_id: str): 
    db = SessionLocal() 

    try: 
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        try: 
            job.status = "processing" 
            db.commit() 
            story_id = StoryGenerator.generate_story(job.topic, db, session_id)
            job.story_id = story_id 
            job.status = "completed" 
            job.completed_at = datetime.now(timezone.utc)
            db.commit()
        except Exception as e: 
            job.status = "error" 
            job.error_message = str(e)
            job.completed_at = datetime.now(timezone.utc)
            db.commit()
    finally: 
        db.close() 




@router.get("/{job_id}", response_model=JobResponse) 
def get_job(job_id: int, db: Session = Depends(get_db)): 
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job: 
        HTTPException(status_code=404, detail="Job not found")
    return job