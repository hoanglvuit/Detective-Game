import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:8282/api'

function App() {
  const [gameState, setGameState] = useState('input') // input, loading, game, result
  const [topic, setTopic] = useState('')
  const [jobId, setJobId] = useState(null)
  const [story, setStory] = useState(null)
  const [suspects, setSuspects] = useState([])
  const [plotPoints, setPlotPoints] = useState([])
  const [openedPlotPoints, setOpenedPlotPoints] = useState(0)
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [error, setError] = useState(null)
  const [wrongGuesses, setWrongGuesses] = useState([])

  // Polling job status
  useEffect(() => {
    if (jobId && gameState === 'loading') {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/job/${jobId}`)
          const job = response.data
          
          if (job.status === 'completed') {
            setGameState('game')
            await loadGameData(job.story_id)
            clearInterval(interval)
          } else if (job.status === 'error') {
            setError(job.error_message || 'Có lỗi xảy ra khi tạo câu chuyện')
            setGameState('input')
            clearInterval(interval)
          }
        } catch (err) {
          setError('Không thể kết nối đến server')
          setGameState('input')
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [jobId, gameState])

  const loadGameData = async (storyId) => {
    try {
      const [storyRes, suspectsRes, plotPointsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/story/${storyId}`),
        axios.get(`${API_BASE_URL}/suspect/${storyId}`),
        axios.get(`${API_BASE_URL}/plot_point/${storyId}`)
      ])

      setStory(storyRes.data)
      setSuspects(suspectsRes.data)
      setPlotPoints(plotPointsRes.data)
    } catch (err) {
      setError('Không thể tải dữ liệu game')
      setGameState('input')
    }
  }

  const createStory = async () => {
    if (!topic.trim()) return

    setError(null)
    setGameState('loading')
    
    try {
      const response = await axios.post(`${API_BASE_URL}/job/create`, {
        topic: topic.trim()
      })
      setJobId(response.data.id)
    } catch (err) {
      setError('Không thể tạo câu chuyện mới')
      setGameState('input')
    }
  }

  const openPlotPoint = (index) => {
    if (openedPlotPoints >= 5) return
    setOpenedPlotPoints(prev => prev + 1)
  }

  const selectSuspect = (suspect) => {
    if (gameResult) return
    setSelectedSuspect(suspect)
  }

  const makeGuess = () => {
    if (!selectedSuspect) return

    const isCorrect = selectedSuspect.is_killer
    
    if (isCorrect) {
      setGameResult({
        correct: true,
        killer: selectedSuspect,
        selected: selectedSuspect
      })
      setGameState('result')
    } else {
      // Thêm vào danh sách đoán sai
      setWrongGuesses(prev => [...prev, selectedSuspect])
      setSelectedSuspect(null) // Reset selection để có thể chọn lại
      
      // Hiển thị thông báo đoán sai tạm thời
      setGameResult({
        correct: false,
        killer: suspects.find(s => s.is_killer),
        selected: selectedSuspect,
        isTemporary: true
      })
      
      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        setGameResult(null)
      }, 3000)
    }
  }

  const resetGame = () => {
    setGameState('input')
    setTopic('')
    setJobId(null)
    setStory(null)
    setSuspects([])
    setPlotPoints([])
    setOpenedPlotPoints(0)
    setSelectedSuspect(null)
    setGameResult(null)
    setError(null)
    setWrongGuesses([])
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔍 Trò Chơi Trinh Thám Ma Mị</h1>
        <p>Nhập chủ đề để tạo một câu chuyện trinh thám và thử tìm ra kẻ giết người!</p>
      </div>

      {gameState === 'input' && (
        <div className="game-phase fade-in">
          <div className="topic-input">
            <input
              type="text"
              placeholder="Nhập chủ đề câu chuyện (ví dụ: 'vụ án trong lâu đài cổ', 'bí ẩn tại bệnh viện')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createStory()}
            />
            <button 
              className="btn" 
              onClick={createStory}
              disabled={!topic.trim()}
            >
              Tạo Câu Chuyện
            </button>
          </div>
          {error && (
            <div style={{ color: '#ff416c', marginTop: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>
      )}

      {gameState === 'loading' && (
        <div className="game-phase fade-in">
          <div className="loading">
            <div className="spinner"></div>
            <div>
              <h3>Đang tạo câu chuyện trinh thám...</h3>
              <p>Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      )}

      {gameState === 'game' && story && (
        <div className="fade-in">
          <div className="game-phase">
            <div className="story-content">
              <h2 className="story-title">{story.title}</h2>
              <div className="story-context">{story.context}</div>
            </div>
          </div>

          <div className="game-phase">
            <h3 style={{ marginBottom: '1rem', color: '#4ecdc4' }}>📋 Danh Sách Nghi Phạm</h3>
            <div className="suspects-grid">
              {suspects.map((suspect, index) => {
                const isWrongGuess = wrongGuesses.some(wg => wg.name === suspect.name)
                return (
                  <div
                    key={index}
                    className={`suspect-card ${
                      selectedSuspect?.name === suspect.name ? 'selected' : ''
                    } ${isWrongGuess ? 'incorrect' : ''}`}
                    onClick={() => selectSuspect(suspect)}
                  >
                    <div className="suspect-name">{suspect.name}</div>
                    <div className="suspect-details">
                      {suspect.sex && suspect.age && `${suspect.sex}, ${suspect.age} tuổi`}
                      {suspect.job && ` • ${suspect.job}`}
                    </div>
                    {suspect.situation && (
                      <div className="suspect-details">Tình huống: {suspect.situation}</div>
                    )}
                    <div className="suspect-description">{suspect.description}</div>
                    {isWrongGuess && (
                      <div style={{ color: '#ff416c', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        ❌ Đã đoán sai
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="game-phase">
            <div className="plot-points">
              <div className="plot-points-header">
                <h3 style={{ color: '#4ecdc4' }}>🔍 Manh Mối ({openedPlotPoints}/5)</h3>
                <div style={{ color: '#b0b0b0' }}>
                  Còn lại: {5 - openedPlotPoints} manh mối
                </div>
              </div>
              <div className="plot-points-grid">
                {plotPoints.map((plotPoint, index) => (
                  <div
                    key={index}
                    className={`plot-point-card ${
                      index < openedPlotPoints ? 'opened' : ''
                    } ${openedPlotPoints >= 5 && index >= openedPlotPoints ? 'disabled' : ''}`}
                    onClick={() => openPlotPoint(index)}
                  >
                    <div className="plot-point-title">
                      {index < openedPlotPoints ? plotPoint.title : '🔒 Manh Mối Bí Ẩn'}
                    </div>
                    {index < openedPlotPoints && (
                      <div className="plot-point-content">{plotPoint.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="game-phase">
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem', color: '#ff6b6b' }}>
                {selectedSuspect ? `Đã chọn: ${selectedSuspect.name}` : 'Chọn nghi phạm để đoán'}
              </h3>
              {wrongGuesses.length > 0 && (
                <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
                  Đã đoán sai {wrongGuesses.length} lần
                </p>
              )}
              <button
                className="btn btn-danger"
                onClick={makeGuess}
                disabled={!selectedSuspect}
              >
                Đoán Kẻ Giết Người
              </button>
            </div>
          </div>

          {/* Thông báo đoán sai tạm thời */}
          {gameResult && gameResult.isTemporary && (
            <div className="game-phase fade-in">
              <div className="game-result incorrect">
                <h3>😞 Đoán Sai Rồi!</h3>
                <p>Hãy thử lại với nghi phạm khác</p>
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'result' && gameResult && !gameResult.isTemporary && (
        <div className="game-phase fade-in">
          <div className={`game-result ${gameResult.correct ? 'correct' : 'incorrect'}`}>
            <h2>
              {gameResult.correct ? '🎉 Chúc Mừng! Bạn Đã Đoán Đúng!' : '😞 Tiếc Quá! Bạn Đã Đoán Sai!'}
            </h2>
            <p>
              {gameResult.correct 
                ? `Bạn đã tìm ra kẻ giết người: ${gameResult.killer.name}`
                : `Kẻ giết người thực sự là: ${gameResult.killer.name}`
              }
            </p>
            <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>
              {gameResult.killer.explanation}
            </p>
            <button className="btn btn-secondary" onClick={resetGame} style={{ marginTop: '2rem' }}>
              Chơi Lại
            </button>
          </div>
        </div>
      )}
      </div>
  )
}

export default App
