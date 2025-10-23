from typing import Optional, List
from pydantic import BaseModel, Field

class SuspectLLMResponse(BaseModel):
    name: str = Field(description="Tên nghi phạm")
    description: str = Field(description="Mô tả ngắn nghi phạm")
    sex: Optional[str] = None
    age: Optional[int] = None
    job: Optional[str] = None
    situation: Optional[str] = None
    is_killer: bool
    explanation: str

class PlotPointLLMResponse(BaseModel):
    title: str = Field(description="Tiêu đề của manh mối, tiêu đề này không tiết lộ (spoil) về nội dung của manh mối")
    content: str = Field(description="Nội dung của manh mối, có thể là một mô tả, yếu tố, sự kiện liên quan hoặc dẫn dắt đến nghi phạm hoặc một sự thật nào đó ví dụ có thể dẫn dắt để loại trừ nghi phạm, manh mối này không nhất thiết phải liên quan đến nghi phạm")
    relevance: int = Field(description="Độ liên quan của manh mối đến nghi phạm, 1 là liên quan ít, 2 là liên quan trung bình, 3 là liên quan nhiều, 4 là liên quan rất nhiều, 5 là liên quan hoàn toàn")

class StoryLLMResponse(BaseModel):
    title: str = Field(description="Tiêu đề của câu chuyện, tiêu đề này không tiết lộ (spoil) về nội dung của câu chuyện")
    context: str = Field(description="Tóm tắt qua tình huống của câu chuyện, tình huống này không tiết lộ về nghi phạm hoặc các manh mối")
    suspects: List[SuspectLLMResponse] = Field(description="Danh sách các nghi phạm trong câu chuyện")
    plot_points: List[PlotPointLLMResponse] = Field(description="Danh sách các manh mối trong câu chuyện, cần đảm bảo có đủ các manh mối từ 1 đến 5")
