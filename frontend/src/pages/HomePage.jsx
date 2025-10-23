import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './HomePage.css'

const API_BASE_URL = 'http://localhost:8282/api'

function HomePage() {
  const [topic, setTopic] = useState('')
  const [storyId, setStoryId] = useState('')
  const [activeTab, setActiveTab] = useState('create') // 'create' or 'join'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const createNewStory = async () => {
    if (!topic.trim()) return

    setError(null)
    setLoading(true)
    
    try {
      const response = await axios.post(`${API_BASE_URL}/job/create`, {
        topic: topic.trim()
      })
      
      // Chuyển đến page chơi game với jobId
      navigate(`/game/loading/${response.data.id}`)
    } catch (err) {
      setError('Không thể tạo câu chuyện mới')
      setLoading(false)
    }
  }

  const joinExistingStory = async () => {
    if (!storyId.trim()) return

    setError(null)
    setLoading(true)
    
    try {
      // Kiểm tra story có tồn tại không
      const response = await axios.get(`${API_BASE_URL}/story/${storyId.trim()}`)
      
      if (response.data) {
        // Chuyển đến page chơi game với storyId
        navigate(`/game/${storyId.trim()}`)
      }
    } catch (err) {
      setError('Không tìm thấy câu chuyện với ID này')
      setLoading(false)
    }
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🔍 Trò Chơi Trinh Thám Ma Mị</h1>
        <p>Chào mừng bạn đến với thế giới trinh thám đầy bí ẩn!</p>
      </div>

      <div className="home-content">
        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            🎭 Tạo Câu Chuyện Mới
          </button>
          <button 
            className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            🎮 Tham Gia Game Có Sẵn
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'create' && (
            <div className="create-story">
              <h3>🎨 Tạo Câu Chuyện Trinh Thám Mới</h3>
              <p>Nhập chủ đề để AI tạo ra một câu chuyện trinh thám độc đáo cho bạn</p>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Ví dụ: 'vụ án trong lâu đài cổ', 'bí ẩn tại bệnh viện', 'tội ác trong trường học'"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewStory()}
                  disabled={loading}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={createNewStory}
                  disabled={!topic.trim() || loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo Câu Chuyện'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'join' && (
            <div className="join-story">
              <h3>🎯 Tham Gia Game Có Sẵn</h3>
              <p>Nhập ID câu chuyện để tham gia game đã được tạo trước đó</p>
              
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nhập Story ID (ví dụ: story_123456)"
                  value={storyId}
                  onChange={(e) => setStoryId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && joinExistingStory()}
                  disabled={loading}
                />
                <button 
                  className="btn btn-secondary" 
                  onClick={joinExistingStory}
                  disabled={!storyId.trim() || loading}
                >
                  {loading ? 'Đang kiểm tra...' : 'Tham Gia Game'}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Đang xử lý...</p>
          </div>
        )}
      </div>

      <div className="home-footer">
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h4>Tạo Câu Chuyện</h4>
            <p>AI sẽ tạo ra câu chuyện trinh thám độc đáo dựa trên chủ đề bạn chọn</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h4>Thu Thập Manh Mối</h4>
            <p>Mở khóa các manh mối để tìm hiểu sự thật đằng sau vụ án</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Phân Tích & Đoán</h4>
            <p>Sử dụng logic và manh mối để tìm ra kẻ giết người</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
