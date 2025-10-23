# 🔍 Trò Chơi Trinh Thám

> **Một trò chơi trinh thám tương tác được xây dựng với AI, nơi người chơi có thể tạo câu chuyện trinh thám từ chủ đề tùy chỉnh và thử tìm ra kẻ giết người.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## ✨ Giới Thiệu

Đây là một **pet project** để practice kĩ năng về backend. 
### 👨‍💻 Thông Tin Tác Giả
- **MSSV**: 22520465
- **Trường**: UIT-HCM (Đại học Công nghệ Thông tin - ĐHQG TP.HCM)
- **Email**: 22520465@gm.uit.edu.vn
- **Chuyên ngành**: Khoa học Máy tính (AI)

## 🎮 Cách Chơi

### 🆕 Tạo Câu Chuyện Mới

1. **Nhập chủ đề**: Bạn có thể nhập bất kỳ chủ đề nào, hãy sáng tạo để có một câu chuyện thú vị: 
   - Chung chung: `"mưa"`, `"phòng kín"`
   - Cụ thể: `"phòng kín trong biệt thự không còn hung khí dường như là một vụ tự sát"`
   - Sáng tạo: `"434344"`, `"bí ẩn tại bệnh viện"`

2. **Chờ tạo câu chuyện**: Thời gian chờ khoảng **30s-1 phút** để AI tạo ra:
   - Đoạn mở đầu câu chuyện
   - Thông tin các nghi phạm
   - Các manh mối liên quan đến vụ án

3. **Thu thập manh mối**: Bạn có **5 lần** mở manh mối. Hãy lựa chọn khôn ngoan! 🧠

4. **Đoán kẻ giết người**: Chọn nghi phạm bạn nghi ngờ và xem kết quả cùng lời giải thích chi tiết ở danh sách nghi phạm.

### 🔄 Chơi Lại Câu Chuyện Cũ

Nhập **Story ID** (ví dụ: `1`, `2`, `3`, `4`, `5`) để quay lại những câu chuyện trong "quá khứ" và thử lại lần nữa.

## 🏗️ Kiến Trúc Hệ Thống

```
📁 root
├── 🔧 backend/                 # FastAPI Backend
│   ├── api/v1/                # API Endpoints
│   ├── core/                  # Business Logic
│   ├── models/                # SQLAlchemy Models
│   ├── schemas/               # Pydantic Schemas
│   └── db/                    # Database Layer
├── 🎨 frontend/               # React Frontend
│   ├── src/pages/             # Game Pages
│   ├── src/assets/            # Static Assets
│   └── public/                # Public Files
└── 📄 README.md               # Documentation
```

## 🚀 Cài Đặt và Chạy

### 📋 Yêu Cầu Hệ Thống
- **Python**: 3.13+
- **Node.js**: 16+
- **Google Gemini API Key**

### 🔧 Backend Setup

```bash
# Clone repository
git clone <repository-url>
cd backend

# Tạo virtual environment
python -m venv .venv
hoặc:
uv init
uv venv 

# Windows
.venv\Scripts\Activate.ps1
# Linux/Mac
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
hoặc: uv pip install -r requirements.txt

# Tạo file .env
DATABASE_URL=sqlite:///./database.db
API_PREFIX=/api
DEBUG=True
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:5173
GEMINI_API_KEY=AIzaSyA1XG

# Chạy server
python main.py
hoặc: uv run main.py
```

Server sẽ chạy tại: `http://localhost:8282`

### 🎨 Frontend Setup

```bash
cd ../frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **FastAPI**: Web framework hiện đại và nhanh
- **SQLAlchemy**: ORM mạnh mẽ cho Python
- **SQLite**: Database nhẹ và dễ sử dụng
- **Google Gemini AI**: AI model để tạo câu chuyện
- **LangChain**: Framework để làm việc với LLM
- **Pydantic**: Data validation và serialization

### Frontend
- **React 19**: UI library hiện đại
- **Vite**: Build tool nhanh
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **CSS3**: Styling với animations và gradients

## 📊 API Documentation

### Base URL
```
http://localhost:8282/api
```

### Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/job/create` | Tạo job tạo câu chuyện mới |
| `GET` | `/job/{job_id}` | Lấy trạng thái job |
| `GET` | `/story/{story_id}` | Lấy thông tin câu chuyện |
| `GET` | `/suspect/{story_id}` | Lấy danh sách nghi phạm |
| `GET` | `/plot_point/{story_id}` | Lấy danh sách manh mối |

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

## 🎯 Game Rules

- ✅ Chỉ được mở tối đa **5 manh mối**
- ✅ Phải chọn một nghi phạm trước khi đoán
- ✅ Không thể thay đổi lựa chọn sau khi đã đoán
- ✅ Có thể chơi lại với chủ đề mới bất cứ lúc nào

## 🎨 UI/UX Features

- **Dark Theme**: Nền tối với gradient màu xanh đen
- **Responsive Design**: Hoạt động tốt trên Desktop, Tablet, Mobile
- **Animations**: Hiệu ứng fade-in, hover, và loading spinner
- **Typography**: Font monospace cho cảm giác retro
- **Accent Colors**: Đỏ, xanh lá, xanh dương cho các element quan trọng

## 📝 Development Notes

> **Lưu ý**: Frontend được phát triển theo phương pháp "vibe-coding" với my friend: Cursor :D  



## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request nếu bạn có ý tưởng cải thiện project.

---

**Được phát triển với ❤️ bởi sinh viên AI tại UIT-HCM** 