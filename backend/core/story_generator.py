from core.config import settings
from core.prompt import PROMPT_TEMPLATE
from core.models import StoryLLMResponse

from langchain_google_genai import GoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from sqlalchemy.orm import Session
from models.suspect import Suspect
from models.plot_point import PlotPoint
from models.story import Story

class StoryGenerator: 

    @classmethod 
    def _get_llm(cls): 
        return GoogleGenerativeAI(model="gemini-2.5-flash", api_key=settings.GEMINI_API_KEY, temperature=0.8)

    @classmethod 
    def generate_story(cls, topic: str, db: Session, session_id: str):
        llm = cls._get_llm()
        if settings.DEBUG:
            print(f"Generating story for topic: {topic}")
        parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)
        prompt = ChatPromptTemplate.from_messages([
            ("system", PROMPT_TEMPLATE),
            ("user", "Tạo một câu chuyện trinh thám về chủ đề {topic}"),
        ])
        chain = prompt | llm | parser
        story_structure = chain.invoke({
            "format_instruction": parser.get_format_instructions(),
            "topic": topic
        })
        
        if settings.DEBUG:
            print("Generate successfully") 

        # Fill story
        story_db = Story(title=story_structure.title, context=story_structure.context, session_id=session_id)
        db.add(story_db) 
        db.flush() 

        if settings.DEBUG:
            print("Filling story")

        # fill plot points
        for plot_point in story_structure.plot_points: 
            plot_point_db = PlotPoint(
                title=plot_point.title, 
                content=plot_point.content, 
                relevance=plot_point.relevance, 
                story_id=story_db.id
            ) 
            db.add(plot_point_db) 
            db.flush() 

        if settings.DEBUG:
            print("Filling plot points")
        
        # fill suspects
        for suspect in story_structure.suspects:
            suspect_db = Suspect(
                name=suspect.name, 
                description=suspect.description, 
                sex=suspect.sex if suspect.sex else None, 
                age=suspect.age if suspect.age else None, 
                job=suspect.job if suspect.job else None, 
                situation=suspect.situation if suspect.situation else None, 
                is_killer=suspect.is_killer, 
                explanation=suspect.explanation, 
                story_id=story_db.id
            )
            db.add(suspect_db) 
            db.flush() 

        if settings.DEBUG:
            print("Filling suspects")

        db.commit()

        return story_db.id


        

# if __name__ == "__main__":
#     generator = StoryGenerator()
#     print(generator.generate_story("căn phòng kín"))