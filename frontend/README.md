# 🔍 Trò Chơi Trinh Thám Ma Mị

Một trò chơi trinh thám tương tác được xây dựng với React và FastAPI, nơi người chơi có thể tạo câu chuyện trinh thám từ chủ đề tùy chỉnh và thử tìm ra kẻ giết người.

## ✨ Tính Năng

- 🎭 **Tạo câu chuyện tùy chỉnh**: Nhập chủ đề để AI tạo ra một câu chuyện trinh thám độc đáo
- 👥 **Nghi phạm đa dạng**: Mỗi câu chuyện có nhiều nghi phạm với thông tin chi tiết
- 🔍 **Manh mối hạn chế**: Chỉ được mở tối đa 5 manh mối để tăng độ khó
- 🎯 **Đoán kẻ giết người**: Phân tích manh mối và chọn ra nghi phạm đúng
- 🎨 **Giao diện ma mị**: Thiết kế dark theme với hiệu ứng ánh sáng đẹp mắt

## 🚀 Cách Chạy

### Yêu Cầu
- Node.js 16+ 
- Backend server đang chạy trên port 8282

### Cài Đặt
```bash
cd frontend
npm install
```

### Chạy Development Server
```bash
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:5173`

## 🎮 Cách Chơi

1. **Nhập chủ đề**: Gõ một chủ đề câu chuyện (ví dụ: "vụ án trong lâu đài cổ", "bí ẩn tại bệnh viện")
2. **Chờ tạo câu chuyện**: AI sẽ tạo ra câu chuyện trinh thám dựa trên chủ đề của bạn
3. **Đọc câu chuyện**: Tìm hiểu tình huống và các nhân vật
4. **Mở manh mối**: Click vào các manh mối để thu thập thông tin (tối đa 5 manh mối)
5. **Chọn nghi phạm**: Click vào nghi phạm bạn nghi ngờ
6. **Đoán kẻ giết người**: Nhấn nút "Đoán Kẻ Giết Người" để xem kết quả

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, Vite, Axios
- **Styling**: CSS3 với animations và gradients
- **API**: RESTful API với FastAPI backend
- **State Management**: React Hooks (useState, useEffect)

## 📱 Responsive Design

Ứng dụng được thiết kế responsive và hoạt động tốt trên:
- Desktop
- Tablet  
- Mobile

## 🎨 Theme

- **Dark Theme**: Nền tối với gradient màu xanh đen
- **Accent Colors**: Đỏ, xanh lá, xanh dương cho các element quan trọng
- **Animations**: Hiệu ứng fade-in, hover, và loading spinner
- **Typography**: Font monospace cho cảm giác retro

## 🔧 Cấu Hình

API endpoint có thể được thay đổi trong file `src/App.jsx`:
```javascript
const API_BASE_URL = 'http://localhost:8282/api'
```

## 📝 Game Flow

```
Input Topic → Create Job → Polling Status → Load Game Data → 
Show Story & Suspects → Open Plot Points → Select Suspect → 
Make Guess → Show Result → Reset Game
```

## 🎯 Game Rules

- Chỉ được mở tối đa 5 manh mối
- Phải chọn một nghi phạm trước khi đoán
- Không thể thay đổi lựa chọn sau khi đã đoán
- Có thể chơi lại với chủ đề mới bất cứ lúc nào