import React, { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'

function TradingChart() {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const [drawingMode, setDrawingMode] = useState('trendline')
  const [drawings, setDrawings] = useState([])
  const drawingStartRef = useRef(null)

  // Generate sample candlestick data for AAPL (Apple)
  const generateSampleData = () => {
    const data = []
    const basePrice = 150
    let currentTime = new Date('2024-01-01').getTime() / 1000

    for (let i = 0; i < 100; i++) {
      const open = basePrice + Math.random() * 20 - 10
      const close = open + Math.random() * 10 - 5
      const high = Math.max(open, close) + Math.random() * 5
      const low = Math.min(open, close) - Math.random() * 5

      data.push({
        time: currentTime,
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2))
      })

      currentTime += 24 * 60 * 60 // Add 1 day
    }

    return data
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1e1e1e' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2b2b43' },
        horzLines: { color: '#2b2b43' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#2b2b43',
      },
      timeScale: {
        borderColor: '#2b2b43',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    seriesRef.current = candlestickSeries

    // Set data
    const data = generateSampleData()
    candlestickSeries.setData(data)

    // Fit content
    chart.timeScale().fitContent()

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    // Add click handler for drawing
    const handleChartClick = (param) => {
      if (!param.time || !param.point) return

      const price = seriesRef.current.coordinateToPrice(param.point.y)

      if (!drawingStartRef.current) {
        // Start drawing
        drawingStartRef.current = {
          time: param.time,
          price: price,
        }
      } else {
        // Complete drawing
        const newDrawing = {
          id: Date.now(),
          type: drawingMode,
          start: drawingStartRef.current,
          end: {
            time: param.time,
            price: price,
          },
        }

        // Create the drawing line
        createDrawing(newDrawing)
        setDrawings(prev => [...prev, newDrawing])
        drawingStartRef.current = null
      }
    }

    chart.subscribeClick(handleChartClick)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [drawingMode])

  const createDrawing = (drawing) => {
    if (!chartRef.current || !seriesRef.current) return

    const { type, start, end } = drawing

    if (type === 'trendline') {
      // Create a trendline using line series
      const lineSeries = chartRef.current.addLineSeries({
        color: '#2196F3',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      lineSeries.setData([
        { time: start.time, value: start.price },
        { time: end.time, value: end.price },
      ])
    } else if (type === 'horizontal') {
      // Create horizontal line
      const lineSeries = chartRef.current.addLineSeries({
        color: '#FF9800',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      lineSeries.setData([
        { time: start.time, value: start.price },
        { time: end.time, value: start.price }, // Same price for horizontal
      ])
    } else if (type === 'rectangle') {
      // Create rectangle using area series
      const areaSeries = chartRef.current.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.4)',
        bottomColor: 'rgba(76, 175, 80, 0.1)',
        lineColor: '#4CAF50',
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      const minTime = Math.min(start.time, end.time)
      const maxTime = Math.max(start.time, end.time)
      const maxPrice = Math.max(start.price, end.price)

      areaSeries.setData([
        { time: minTime, value: maxPrice },
        { time: maxTime, value: maxPrice },
      ])
    }
  }

  const clearAllDrawings = () => {
    if (chartRef.current) {
      // Remove and recreate the chart to clear all drawings
      const container = chartContainerRef.current
      const width = container.clientWidth

      chartRef.current.remove()

      const chart = createChart(container, {
        width: width,
        height: 500,
        layout: {
          background: { color: '#1e1e1e' },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#2b2b43' },
          horzLines: { color: '#2b2b43' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#2b2b43',
        },
        timeScale: {
          borderColor: '#2b2b43',
          timeVisible: true,
          secondsVisible: false,
        },
      })

      chartRef.current = chart

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })

      seriesRef.current = candlestickSeries
      const data = generateSampleData()
      candlestickSeries.setData(data)
      chart.timeScale().fitContent()
    }

    setDrawings([])
    drawingStartRef.current = null
  }

  return (
    <div className="chart-wrapper">
      <div className="toolbar">
        <button
          className={`tool-btn ${drawingMode === 'trendline' ? 'active' : ''}`}
          onClick={() => setDrawingMode('trendline')}
        >
          Trendline
        </button>
        <button
          className={`tool-btn ${drawingMode === 'horizontal' ? 'active' : ''}`}
          onClick={() => setDrawingMode('horizontal')}
        >
          Horizontal Line
        </button>
        <button
          className={`tool-btn ${drawingMode === 'rectangle' ? 'active' : ''}`}
          onClick={() => setDrawingMode('rectangle')}
        >
          Rectangle
        </button>
        <button
          className="tool-btn clear-btn"
          onClick={clearAllDrawings}
        >
          Clear All
        </button>
      </div>

      <div className="chart-info">
        <span className="info-label">Symbol: <strong>AAPL</strong></span>
        <span className="info-label">Active Tool: <strong>{drawingMode}</strong></span>
        <span className="info-label">Drawings: <strong>{drawings.length}</strong></span>
      </div>

      <div ref={chartContainerRef} className="chart-container" />

      <div className="instructions">
        Click once to start drawing, click again to finish. Use the toolbar to switch between drawing tools.
      </div>
    </div>
  )
}

export default TradingChart
