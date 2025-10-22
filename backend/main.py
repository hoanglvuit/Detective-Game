from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.v1 import job, story, plot_point, suspect 
from db.base import create_tables

create_tables()

app = FastAPI(title="Sherlock Holmes API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(job.router, prefix=settings.API_PREFIX)
app.include_router(story.router, prefix=settings.API_PREFIX)
app.include_router(plot_point.router, prefix=settings.API_PREFIX)
app.include_router(suspect.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8282)