import React, { useState } from 'react'
import TradingChart from './TradingChart'
import TradingViewChartingLibDemo from './TradingViewChartingLibDemo'

function App() {
  const [viewMode, setViewMode] = useState('comparison') // 'comparison', 'lightweight', 'commercial'

  return (
    <div className="app">
      <div className="header">
        <h1>TradingView Chart Implementations - Side-by-Side Comparison</h1>
        <p>Compare free Lightweight Charts vs. Commercial Charting Library with Drawings API</p>
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setViewMode('comparison')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            background: viewMode === 'comparison'
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#e0e0e0',
            color: viewMode === 'comparison' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          📊 Side-by-Side Comparison
        </button>
        <button
          onClick={() => setViewMode('lightweight')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            background: viewMode === 'lightweight'
              ? 'linear-gradient(135deg, #26a69a 0%, #00897b 100%)'
              : '#e0e0e0',
            color: viewMode === 'lightweight' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          🆓 Lightweight Charts Only
        </button>
        <button
          onClick={() => setViewMode('commercial')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            background: viewMode === 'commercial'
              ? 'linear-gradient(135deg, #ff6b00 0%, #ff9800 100%)'
              : '#e0e0e0',
            color: viewMode === 'commercial' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          💼 Commercial API Demo
        </button>
      </div>

      {viewMode === 'comparison' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{
              background: '#26a69a',
              color: 'white',
              padding: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px 8px 0 0'
            }}>
              🆓 Lightweight Charts (Current Implementation)
            </div>
            <TradingChart autoDraw={false} symbol="AAPL" />
          </div>
          <div>
            <div style={{
              background: '#ff6b00',
              color: 'white',
              padding: '10px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '8px 8px 0 0'
            }}>
              💼 TradingView Charting Library (Demo - License Required)
            </div>
            <TradingViewChartingLibDemo symbol="GOOGL" />
          </div>
        </div>
      )}

      {viewMode === 'lightweight' && (
        <div>
          <TradingChart autoDraw={true} symbol="AAPL" />
        </div>
      )}

      {viewMode === 'commercial' && (
        <div>
          <TradingViewChartingLibDemo symbol="GOOGL" />
        </div>
      )}

      <div style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>📚 Key Differences</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px' }}>
            <h3 style={{ color: '#26a69a', marginTop: 0 }}>🆓 Lightweight Charts</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <li>✅ <strong>Free & Open Source</strong></li>
              <li>✅ MIT License</li>
              <li>⚠️ Basic drawing support (manual implementation)</li>
              <li>⚠️ Limited built-in drawing tools</li>
              <li>✅ Good for simple charting needs</li>
              <li>✅ Lightweight bundle size</li>
            </ul>
          </div>
          <div style={{ background: 'white', padding: '15px', borderRadius: '6px' }}>
            <h3 style={{ color: '#ff6b00', marginTop: 0 }}>💼 TradingView Charting Library</h3>
            <ul style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <li>💰 <strong>Commercial License Required</strong></li>
              <li>✅ Full Drawings API</li>
              <li>✅ 100+ built-in drawing tools</li>
              <li>✅ Shape management (create, edit, delete, group)</li>
              <li>✅ Execution shapes for trading</li>
              <li>✅ Advanced features & indicators</li>
              <li>✅ Professional-grade charting</li>
            </ul>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fff3cd',
          borderLeft: '4px solid #ffc107',
          borderRadius: '4px'
        }}>
          <h3 style={{ marginTop: 0, color: '#856404' }}>💡 Recommendation</h3>
          <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
            <strong>Choose Lightweight Charts if:</strong> You need basic charting with simple drawing capabilities and want to keep costs low.
            <br /><br />
            <strong>Choose TradingView Charting Library if:</strong> You're building a professional trading platform that requires advanced drawing tools,
            technical analysis features, and a polished user experience. Contact TradingView for licensing:
            <a href="https://www.tradingview.com/charting-library/" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc' }}>
              https://www.tradingview.com/charting-library/
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
