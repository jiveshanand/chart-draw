import React from 'react'
import TradingChart from './TradingChart'

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>TradingView Chart with Drawing Tools</h1>
        <p>Click on the chart to draw lines and shapes</p>
      </div>
      <TradingChart />
    </div>
  )
}

export default App
