import React, { useState } from 'react'
import TradingChart from './TradingChart'

function App() {
  const [showAutoChart, setShowAutoChart] = useState(false)

  const handleAutoDrawClick = () => {
    setShowAutoChart(true)
  }

  return (
    <div className="app">
      <div className="header">
        <h1>TradingView Chart with Drawing Tools</h1>
        <p>Click on the chart to draw lines and shapes</p>
      </div>

      {!showAutoChart && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={handleAutoDrawClick}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            📈 Open Stock Chart with Auto Trend Line
          </button>
        </div>
      )}

      {showAutoChart ? (
        <TradingChart autoDraw={true} symbol="TSLA" />
      ) : (
        <TradingChart autoDraw={false} symbol="AAPL" />
      )}
    </div>
  )
}

export default App
