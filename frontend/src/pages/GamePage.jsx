import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './GamePage.css'

const API_BASE_URL = 'http://localhost:8282/api'

function GamePage() {
  const { storyId, jobId } = useParams()
  const navigate = useNavigate()
  
  const [gameState, setGameState] = useState(jobId ? 'loading' : 'game') // loading, game, result
  const [story, setStory] = useState(null)
  const [suspects, setSuspects] = useState([])
  const [plotPoints, setPlotPoints] = useState([])
  const [openedPlotPoints, setOpenedPlotPoints] = useState(new Set())
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [error, setError] = useState(null)
  const [wrongGuesses, setWrongGuesses] = useState([])
  const [showExplanation, setShowExplanation] = useState(null) // {suspect, explanation}

  // Polling job status nếu có jobId
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
            setGameState('game')
            clearInterval(interval)
          }
        } catch (err) {
          setError('Không thể kết nối đến server')
          setGameState('game')
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    } else if (storyId) {
      // Load game data trực tiếp nếu có storyId
      loadGameData(storyId)
    }
  }, [jobId, storyId, gameState])

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
      setGameState('game')
    } catch (err) {
      setError('Không thể tải dữ liệu game')
      setGameState('game')
    }
  }

  const openPlotPoint = (index) => {
    if (openedPlotPoints.size >= 5) return
    if (openedPlotPoints.has(index)) return // Đã mở rồi thì không mở lại
    
    setOpenedPlotPoints(prev => new Set([...prev, index]))
  }

  const selectSuspect = (suspect) => {
    if (gameResult) return
    setSelectedSuspect(suspect)
  }

  const makeGuess = () => {
    if (!selectedSuspect) return

    const isCorrect = selectedSuspect.is_killer
    const actualKiller = suspects.find(s => s.is_killer)
    
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
      
      // Hiển thị thông báo đoán sai đơn giản
      setGameResult({
        correct: false,
        killer: actualKiller,
        selected: selectedSuspect,
        isTemporary: true
      })
      
      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        setGameResult(null)
      }, 3000)
    }
  }

  const showSuspectExplanation = (suspect) => {
    setShowExplanation({
      suspect: suspect,
      explanation: suspect.explanation
    })
  }

  const closeExplanation = () => {
    setShowExplanation(null)
  }

  const goHome = () => {
    navigate('/')
  }

  const resetGame = () => {
    setGameState('game')
    setOpenedPlotPoints(new Set())
    setSelectedSuspect(null)
    setGameResult(null)
    setError(null)
    setWrongGuesses([])
  }

  if (gameState === 'loading') {
    return (
      <div className="game-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <div>
            <h3>Đang tạo câu chuyện trinh thám...</h3>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={goHome}>
          ← Về Trang Chủ
        </button>
        <h1>🔍 Trò Chơi Trinh Thám</h1>
        {story && (
          <div className="story-info">
            <span className="story-id">ID: {story.id}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {gameState === 'game' && story && (
        <div className="game-content">
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
                    className={`suspect-card fade-in ${
                      selectedSuspect?.name === suspect.name ? 'selected' : ''
                    } ${isWrongGuess ? 'incorrect' : ''}`}
                    onClick={() => selectSuspect(suspect)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="suspect-header">
                      <div className="suspect-avatar">
                        {suspect.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="suspect-info">
                        <div className="suspect-name">{suspect.name}</div>
                        <div className="suspect-basic-info">
                          {suspect.sex && suspect.age && (
                            <span className="info-badge age">{suspect.sex}, {suspect.age} tuổi</span>
                          )}
                          {suspect.job && (
                            <span className="info-badge job">{suspect.job}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {suspect.situation && (
                      <div className="suspect-situation">
                        <span className="situation-label">Tình huống:</span>
                        <span className="situation-text">{suspect.situation}</span>
                      </div>
                    )}
                    
                    <div className="suspect-description">{suspect.description}</div>
                    
                    {isWrongGuess && (
                      <div className="wrong-guess-indicator">
                        <span className="wrong-icon">❌</span>
                        <span>Đã đoán sai</span>
                        <button 
                          className="explanation-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            showSuspectExplanation(suspect)
                          }}
                        >
                          💭 Xem Explanation
                        </button>
                      </div>
                    )}
                    
                    {selectedSuspect?.name === suspect.name && (
                      <div className="selected-indicator">
                        <span className="selected-icon">✓</span>
                        <span>Đã chọn</span>
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
                <h3 style={{ color: '#4ecdc4' }}>🔍 Manh Mối ({openedPlotPoints.size}/5)</h3>
                <div style={{ color: '#b0b0b0' }}>
                  Còn lại: {5 - openedPlotPoints.size} manh mối
                </div>
              </div>
              <div className="plot-points-grid">
                {plotPoints.map((plotPoint, index) => (
                  <div
                    key={index}
                    className={`plot-point-card fade-in ${
                      openedPlotPoints.has(index) ? 'opened' : ''
                    } ${openedPlotPoints.size >= 5 && !openedPlotPoints.has(index) ? 'disabled' : ''}`}
                    onClick={() => openPlotPoint(index)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="plot-point-title">
                      {plotPoint.title}
                    </div>
                    {openedPlotPoints.has(index) ? (
                      <div className="plot-point-details">
                        <div className="plot-point-content">{plotPoint.content}</div>
                        <div className="plot-point-relevance">
                          <span className="relevance-label">Độ liên quan:</span>
                          <div className={`relevance-badge relevance-${plotPoint.relevance}`}>
                            {plotPoint.relevance}/3
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="plot-point-locked">
                        <span className="lock-icon">🔒</span>
                        <span className="lock-text">Nhấn để mở khóa</span>
                      </div>
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
                <p><strong>{gameResult.selected.name}</strong> không phải là kẻ giết người</p>
                <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>
                  Hãy thử lại với nghi phạm khác
                </p>
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
            
            <div className="result-actions">
              <button className="btn btn-secondary" onClick={resetGame}>
                Chơi Lại
              </button>
              <button className="btn btn-primary" onClick={goHome}>
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explanation Modal */}
      {showExplanation && (
        <div className="modal-overlay" onClick={closeExplanation}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💭 Explanation - {showExplanation.suspect.name}</h3>
              <button className="close-btn" onClick={closeExplanation}>×</button>
            </div>
            <div className="modal-body">
              <div className="explanation-content">
                {showExplanation.explanation}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeExplanation}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePage
