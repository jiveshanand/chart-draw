import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'

/**
 * DEMO: TradingView Charting Library with Drawings API
 *
 * This component demonstrates what the commercial TradingView Charting Library
 * Drawings API would look like. This is a MOCK implementation for comparison purposes.
 *
 * Real TradingView Charting Library requires a license:
 * https://www.tradingview.com/charting-library-docs/
 *
 * Key Features of Real Drawings API:
 * - widget.chart().createShape() - Create single-point drawings (arrows, icons, lines)
 * - widget.chart().createMultipointShape() - Create multi-point drawings (trend lines, rectangles)
 * - widget.chart().createExecutionShape() - Create buy/sell execution arrows
 * - widget.chart().createAnchoredShape() - Create anchored drawings (fixed position)
 * - widget.chart().getShapeById() - Manage individual drawings
 * - widget.chart().getAllShapes() - Get all drawings
 * - widget.chart().removeEntity() - Remove specific drawing
 * - widget.chart().removeAllShapes() - Clear all drawings
 * - Drawing events and grouping
 */
function TradingViewChartingLibDemo({ symbol = 'GOOGL' }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const [apiLog, setApiLog] = useState([])
  const [drawings, setDrawings] = useState([])
  const drawingIdCounter = useRef(0)

  // Generate sample data for different stock
  const generateSampleData = () => {
    const data = []
    const basePrice = 140
    let currentTime = new Date('2024-01-01').getTime() / 1000

    for (let i = 0; i < 100; i++) {
      const trend = i * 0.3 // Upward trend
      const open = basePrice + trend + Math.random() * 15 - 7.5
      const close = open + Math.random() * 8 - 4
      const high = Math.max(open, close) + Math.random() * 4
      const low = Math.min(open, close) - Math.random() * 4

      data.push({
        time: currentTime,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      })

      currentTime += 24 * 60 * 60
    }

    return data
  }

  const addLog = (message, code = null) => {
    setApiLog(prev => [...prev, { message, code, timestamp: new Date().toLocaleTimeString() }])
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#e1e1e1' },
        horzLines: { color: '#e1e1e1' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#d1d1d1',
      },
      timeScale: {
        borderColor: '#d1d1d1',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#089981',
      downColor: '#f23645',
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#f23645',
    })

    seriesRef.current = candlestickSeries
    const data = generateSampleData()
    candlestickSeries.setData(data)
    chart.timeScale().fitContent()

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    addLog('📊 Chart initialized (mock TradingView Charting Library)')

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  // Mock API Methods (demonstrating real TradingView Drawings API)

  /**
   * MOCK: widget.chart().createShape()
   * Creates a single-point drawing (arrow, icon, vertical/horizontal line)
   */
  const mockCreateShape = (point, options) => {
    const id = `shape_${drawingIdCounter.current++}`

    addLog(
      `✨ createShape() called - Creating ${options.shape}`,
      `widget.chart().createShape(\n  { time: ${point.time}, price: ${point.price} },\n  { shape: "${options.shape}", ${options.text ? `text: "${options.text}"` : ''} }\n)`
    )

    // Simulate drawing creation
    if (chartRef.current && seriesRef.current) {
      const marker = {
        time: point.time,
        position: options.shape === 'arrow_up' ? 'belowBar' : 'aboveBar',
        color: options.color || '#2196F3',
        shape: options.shape === 'arrow_up' ? 'arrowUp' : 'arrowDown',
        text: options.text || options.shape,
      }

      seriesRef.current.setMarkers([marker])
    }

    setDrawings(prev => [...prev, { id, type: 'shape', shape: options.shape, point }])
    return Promise.resolve(id)
  }

  /**
   * MOCK: widget.chart().createMultipointShape()
   * Creates a multi-point drawing (trend line, rectangle, triangle)
   */
  const mockCreateMultipointShape = (points, options) => {
    const id = `multipoint_${drawingIdCounter.current++}`

    addLog(
      `✨ createMultipointShape() called - Creating ${options.shape}`,
      `widget.chart().createMultipointShape(\n  [\n    { time: ${points[0].time}, price: ${points[0].price} },\n    { time: ${points[1].time}, price: ${points[1].price} }\n  ],\n  { shape: "${options.shape}", text: "${options.text || ''}" }\n)`
    )

    // Simulate drawing creation
    if (chartRef.current && options.shape === 'trend_line') {
      const lineSeries = chartRef.current.addLineSeries({
        color: options.color || '#FF6B00',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      lineSeries.setData([
        { time: points[0].time, value: points[0].price },
        { time: points[1].time, value: points[1].price },
      ])
    }

    setDrawings(prev => [...prev, { id, type: 'multipoint', shape: options.shape, points }])
    return Promise.resolve(id)
  }

  /**
   * MOCK: widget.chart().createExecutionShape()
   * Creates buy/sell execution arrows
   */
  const mockCreateExecutionShape = (point, options) => {
    const id = `execution_${drawingIdCounter.current++}`

    addLog(
      `✨ createExecutionShape() called - ${options.direction} execution`,
      `widget.chart().createExecutionShape(\n  { time: ${point.time}, price: ${point.price} },\n  { direction: "${options.direction}", text: "${options.text}" }\n)`
    )

    setDrawings(prev => [...prev, { id, type: 'execution', direction: options.direction, point }])
    return Promise.resolve(id)
  }

  /**
   * MOCK: widget.chart().getAllShapes()
   * Gets all drawings with their IDs
   */
  const mockGetAllShapes = () => {
    addLog(`📋 getAllShapes() called - Found ${drawings.length} drawings`, `widget.chart().getAllShapes()`)
    console.log('All shapes:', drawings)
    return drawings
  }

  /**
   * MOCK: widget.chart().removeAllShapes()
   * Removes all drawings from the chart
   */
  const mockRemoveAllShapes = () => {
    addLog('🗑️ removeAllShapes() called - Clearing all drawings', `widget.chart().removeAllShapes()`)
    setDrawings([])

    // Clear visual drawings
    if (chartRef.current && seriesRef.current) {
      seriesRef.current.setMarkers([])
    }
  }

  // Demo Actions
  const demoCreateTrendLine = () => {
    const data = generateSampleData()
    const startPoint = data[20]
    const endPoint = data[70]

    mockCreateMultipointShape(
      [
        { time: startPoint.time, price: startPoint.low },
        { time: endPoint.time, price: endPoint.high }
      ],
      { shape: 'trend_line', text: 'Uptrend', color: '#FF6B00' }
    )
  }

  const demoCreateArrow = () => {
    const data = generateSampleData()
    const point = data[40]

    mockCreateShape(
      { time: point.time, price: point.high + 5 },
      { shape: 'arrow_down', text: 'Resistance', color: '#f23645' }
    )
  }

  const demoCreateExecutions = () => {
    const data = generateSampleData()

    // Buy execution
    mockCreateExecutionShape(
      { time: data[30].time, price: data[30].low },
      { direction: 'buy', text: 'BUY @ 145.20' }
    )

    // Sell execution
    setTimeout(() => {
      mockCreateExecutionShape(
        { time: data[60].time, price: data[60].high },
        { direction: 'sell', text: 'SELL @ 163.80' }
      )
    }, 500)
  }

  return (
    <div className="chart-wrapper" style={{ background: '#f8f9fa' }}>
      <div className="demo-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px 8px 0 0'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
          🎯 TradingView Charting Library - Drawings API Demo
        </h3>
        <p style={{ margin: 0, fontSize: '13px', opacity: 0.95 }}>
          Mock implementation showing API structure (requires commercial license)
        </p>
      </div>

      <div className="toolbar" style={{ background: '#fff', borderBottom: '1px solid #e1e1e1' }}>
        <button
          className="tool-btn"
          onClick={demoCreateTrendLine}
          style={{ background: '#FF6B00', color: 'white' }}
        >
          📈 Create Trend Line
        </button>
        <button
          className="tool-btn"
          onClick={demoCreateArrow}
          style={{ background: '#f23645', color: 'white' }}
        >
          ⬇️ Create Arrow
        </button>
        <button
          className="tool-btn"
          onClick={demoCreateExecutions}
          style={{ background: '#089981', color: 'white' }}
        >
          💹 Create Executions
        </button>
        <button
          className="tool-btn"
          onClick={mockGetAllShapes}
        >
          📋 Get All Shapes
        </button>
        <button
          className="tool-btn clear-btn"
          onClick={mockRemoveAllShapes}
        >
          🗑️ Remove All
        </button>
      </div>

      <div className="chart-info" style={{ background: '#fff', borderBottom: '1px solid #e1e1e1' }}>
        <span className="info-label">Symbol: <strong>{symbol}</strong></span>
        <span className="info-label">Library: <strong>TradingView Charting Library (DEMO)</strong></span>
        <span className="info-label">Drawings: <strong>{drawings.length}</strong></span>
        <span className="info-label" style={{ color: '#764ba2', fontWeight: 'bold' }}>
          ⚠️ Mock API - License Required
        </span>
      </div>

      <div ref={chartContainerRef} className="chart-container" style={{ background: '#fff' }} />

      <div className="api-log" style={{
        background: '#1e1e1e',
        color: '#00ff00',
        padding: '15px',
        maxHeight: '200px',
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace',
        borderRadius: '0 0 8px 8px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
          📝 API Call Log:
        </div>
        {apiLog.map((log, index) => (
          <div key={index} style={{ marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
            <div style={{ color: '#888' }}>[{log.timestamp}]</div>
            <div style={{ color: '#00ff00' }}>{log.message}</div>
            {log.code && (
              <pre style={{
                background: '#0d0d0d',
                padding: '8px',
                marginTop: '5px',
                borderLeft: '3px solid #667eea',
                color: '#ff79c6'
              }}>
                {log.code}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="instructions" style={{ background: '#fff3cd', color: '#856404', padding: '12px', margin: '10px 0', borderRadius: '4px' }}>
        <strong>💡 Note:</strong> This is a demo showing the TradingView Charting Library API structure.
        To use the real API with full features, you need a commercial license from TradingView.
      </div>
    </div>
  )
}

export default TradingViewChartingLibDemo
