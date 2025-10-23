import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/loading/:jobId" element={<GamePage />} />
          <Route path="/game/:storyId" element={<GamePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
