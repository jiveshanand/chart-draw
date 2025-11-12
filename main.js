import { createChart } from 'lightweight-charts';
import { DrawingManager } from './drawingManager.js';

// Generate sample candlestick data
function generateCandlestickData(days = 200) {
    const data = [];
    let basePrice = 100;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Add some volatility
        const change = (Math.random() - 0.5) * 4;
        basePrice += change;
        
        const open = basePrice + (Math.random() - 0.5) * 2;
        const close = basePrice + (Math.random() - 0.5) * 2;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        
        data.push({
            time: date.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
        });
    }
    
    return data;
}

// Initialize the application
class TradingChartApp {
    constructor() {
        this.chart = null;
        this.candlestickSeries = null;
        this.drawingManager = null;
        this.activeTool = null;
        
        this.init();
    }
    
    init() {
        // Create chart container
        const container = document.getElementById('chart-container');
        
        // Create chart
        this.chart = createChart(container, {
            width: container.clientWidth,
            height: container.clientHeight,
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
                borderColor: '#cccccc',
            },
            timeScale: {
                borderColor: '#cccccc',
                timeVisible: true,
            },
        });
        
        // Add candlestick series
        this.candlestickSeries = this.chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        
        // Load sample data
        const data = generateCandlestickData();
        this.candlestickSeries.setData(data);
        
        // Fit content
        this.chart.timeScale().fitContent();
        
        // Initialize drawing manager
        this.drawingManager = new DrawingManager(this.chart, container);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.chart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight
            });
        });
    }
    
    setupEventListeners() {
        // Trendline button
        document.getElementById('btn-trendline').addEventListener('click', () => {
            this.setActiveTool('trendline');
        });
        
        // Horizontal line button
        document.getElementById('btn-horizontal').addEventListener('click', () => {
            this.setActiveTool('horizontal');
        });
        
        // Vertical line button
        document.getElementById('btn-vertical').addEventListener('click', () => {
            this.setActiveTool('vertical');
        });
        
        // Rectangle button
        document.getElementById('btn-rectangle').addEventListener('click', () => {
            this.setActiveTool('rectangle');
        });
        
        // Clear button
        document.getElementById('btn-clear').addEventListener('click', () => {
            this.drawingManager.clearAll();
            this.updateDrawingCount();
        });
        
        // Undo button
        document.getElementById('btn-undo').addEventListener('click', () => {
            this.drawingManager.undo();
            this.updateDrawingCount();
        });
        
        // Listen to drawing complete events
        document.addEventListener('drawingComplete', () => {
            this.updateDrawingCount();
            this.deactivateTool();
        });
    }
    
    setActiveTool(tool) {
        // Remove active class from all buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (this.activeTool === tool) {
            // Deactivate if clicking the same tool
            this.activeTool = null;
            this.drawingManager.setDrawingMode(null);
            document.getElementById('active-tool').textContent = 'None';
        } else {
            // Activate new tool
            this.activeTool = tool;
            this.drawingManager.setDrawingMode(tool);
            document.getElementById(`btn-${tool}`).classList.add('active');
            document.getElementById('active-tool').textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
        }
    }
    
    deactivateTool() {
        this.activeTool = null;
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('active-tool').textContent = 'None';
    }
    
    updateDrawingCount() {
        const count = this.drawingManager.getDrawingCount();
        document.getElementById('drawing-count').textContent = count;
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    new TradingChartApp();
});
