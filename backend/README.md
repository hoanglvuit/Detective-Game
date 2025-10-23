# 🔍 Backend API - Trò Chơi Trinh Thám Ma Mị

Backend API cho trò chơi trinh thám tương tác được xây dựng với FastAPI và Google Gemini AI, tạo ra các câu chuyện trinh thám độc đáo dựa trên chủ đề người dùng nhập vào.

## ✨ Tính Năng

- 🤖 **AI Story Generation**: Sử dụng Google Gemini AI để tạo câu chuyện trinh thám
- 🎭 **Dynamic Content**: Tạo nghi phạm, manh mối và cốt truyện động
- 🔄 **Background Processing**: Xử lý tạo câu chuyện bất đồng bộ
- 📊 **Session Management**: Quản lý phiên người dùng với cookies
- 🗄️ **Database Integration**: SQLAlchemy ORM với SQLite database
- 🚀 **RESTful API**: API endpoints đầy đủ cho frontend

## 🏗️ Kiến Trúc

```
backend/
├── api/v1/           # API endpoints
│   ├── job.py        # Job management (create, status)
│   ├── story.py      # Story retrieval
│   ├── suspect.py    # Suspect data
│   └── plot_point.py # Plot points/clues
├── core/             # Core business logic
│   ├── config.py     # Configuration settings
│   ├── models.py     # Pydantic models for AI responses
│   ├── prompt.py     # AI prompt templates
│   └── story_generator.py # AI story generation logic
├── db/               # Database layer
│   ├── base.py       # Database base and engine
│   ├── session.py    # Database session management
│   └── init_db.py    # Database initialization
├── models/           # SQLAlchemy models
│   ├── job.py        # Job model
│   ├── story.py      # Story model
│   ├── suspect.py    # Suspect model
│   └── plot_point.py # Plot point model
├── schemas/          # Pydantic schemas for API
│   ├── job.py        # Job request/response schemas
│   ├── story.py      # Story response schema
│   ├── suspect.py    # Suspect response schema
│   └── plot_point.py # Plot point response schema
└── main.py           # FastAPI application entry point
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu
- Python 3.13+
- Google Gemini API key

### Cài Đặt Dependencies
```bash
# Sử dụng pip
pip install -r requirements.txt

# Hoặc sử dụng uv (khuyến nghị)
uv venv
.venv\Scripts\Activate.ps1 
uv pip install -r requirements.rxt
```

### Cấu Hình Environment
Tạo file `.env` trong thư mục backend:
```env
DATABASE_URL=sqlite:///./database.db
API_PREFIX=/api
DEBUG=True
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:5173
GEMINI_API_KEY=AIzaSyA1XG8BH
```

### Chạy Server
```bash
# Development mode
python main.py

# Hoặc dùng uv 
uv run main.py
```

Server sẽ chạy tại `http://localhost:8282`

## 📚 API Documentation

### Base URL
```
http://localhost:8282/api
```

### Endpoints

#### 1. Job Management
- **POST** `/job/create` - Tạo job tạo câu chuyện mới
- **GET** `/job/{job_id}` - Lấy trạng thái job

#### 2. Story Data
- **GET** `/story/{story_id}` - Lấy thông tin câu chuyện
- **GET** `/suspect/{story_id}` - Lấy danh sách nghi phạm
- **GET** `/plot_point/{story_id}` - Lấy danh sách manh mối

### API Flow
```
1. POST /job/create → Tạo job với chủ đề
2. GET /job/{job_id} → Kiểm tra trạng thái (pending → processing → completed)
3. GET /story/{story_id} → Lấy thông tin câu chuyện
4. GET /suspect/{story_id} → Lấy danh sách nghi phạm
5. GET /plot_point/{story_id} → Lấy danh sách manh mối
```

## 🗄️ Database Schema

### Job Table
- `id`: Primary key
- `session_id`: Session identifier
- `story_id`: Reference to generated story
- `topic`: User input topic
- `status`: pending/processing/completed/error
- `error_message`: Error details if failed
- `created_at`: Creation timestamp
- `completed_at`: Completion timestamp
- `total_tokens`: AI token usage

### Story Table
- `id`: Primary key
- `title`: Story title
- `context`: Story introduction
- `session_id`: Session identifier
- `created_at`: Creation timestamp

### Suspect Table
- `id`: Primary key
- `story_id`: Reference to story
- `name`: Suspect name
- `description`: Suspect description
- `sex`: Gender (optional)
- `age`: Age (optional)
- `job`: Occupation (optional)
- `situation`: Current situation (optional)
- `is_killer`: Boolean - is this the killer
- `explanation`: Explanation for killer status

### PlotPoint Table
- `id`: Primary key
- `story_id`: Reference to story
- `title`: Plot point title
- `content`: Plot point content
- `relevance`: Relevance level (1-5)

## 🤖 AI Integration

### Google Gemini AI
- **Model**: `gemini-2.5-flash`
- **Temperature**: 0.8 (creative but consistent)
- **Output Format**: Structured JSON using Pydantic

### Prompt Engineering
- Vietnamese prompts for better localization
- Structured output with specific schemas
- Context-aware story generation
- Logical plot development
