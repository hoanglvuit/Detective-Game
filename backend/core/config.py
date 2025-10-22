from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings): 
    API_PREFIX: str = "api" 
    DATABASE_URL: str = None 
    DEBUG: bool = False
    ALLOWED_ORIGIN: str = ""
    GEMINI_API_KEY: str = None

    @field_validator("ALLOWED_ORIGIN") 
    def parse_allowed_origin(cls, v: str) -> List[str]:
        return v.split(",")
    
    class Config: 
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()