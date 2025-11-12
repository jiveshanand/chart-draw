export class DrawingManager {
    constructor(chart, container) {
        this.chart = chart;
        this.container = container;
        this.drawings = [];
        this.currentDrawing = null;
        this.drawingMode = null;
        this.startPoint = null;
        
        // Create SVG overlay for drawings
        this.svgOverlay = this.createSVGOverlay();
        
        // Bind methods
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        
        this.setupEventListeners();
    }
    
    createSVGOverlay() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '10';
        this.container.appendChild(svg);
        return svg;
    }
    
    setupEventListeners() {
        this.container.addEventListener('mousedown', this.handleMouseDown);
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseup', this.handleMouseUp);
    }
    
    setDrawingMode(mode) {
        this.drawingMode = mode;
        this.startPoint = null;
        this.currentDrawing = null;
        
        if (mode) {
            this.container.style.cursor = 'crosshair';
            this.svgOverlay.style.pointerEvents = 'all';
        } else {
            this.container.style.cursor = 'default';
            this.svgOverlay.style.pointerEvents = 'none';
        }
    }
    
    handleMouseDown(event) {
        if (!this.drawingMode) return;
        
        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert pixel coordinates to chart coordinates
        const timeScale = this.chart.timeScale();
        const priceScale = this.chart.priceScale();
        
        const time = timeScale.coordinateToTime(x);
        const price = priceScale.coordinateToPrice(y);
        
        if (!time || !price) return;
        
        this.startPoint = { x, y, time, price };
        
        // Create temporary drawing element
        this.currentDrawing = this.createDrawingElement(this.drawingMode);
        this.svgOverlay.appendChild(this.currentDrawing);
    }
    
    handleMouseMove(event) {
        if (!this.drawingMode || !this.startPoint || !this.currentDrawing) return;
        
        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.updateDrawing(this.currentDrawing, this.startPoint, { x, y });
    }
    
    handleMouseUp(event) {
        if (!this.drawingMode || !this.startPoint || !this.currentDrawing) return;
        
        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const timeScale = this.chart.timeScale();
        const priceScale = this.chart.priceScale();
        
        const endTime = timeScale.coordinateToTime(x);
        const endPrice = priceScale.coordinateToPrice(y);
        
        if (!endTime || !endPrice) {
            this.svgOverlay.removeChild(this.currentDrawing);
            this.currentDrawing = null;
            this.startPoint = null;
            return;
        }
        
        const endPoint = { x, y, time: endTime, price: endPrice };
        
        // Finalize the drawing
        this.updateDrawing(this.currentDrawing, this.startPoint, endPoint);
        
        // Store the drawing
        this.drawings.push({
            type: this.drawingMode,
            element: this.currentDrawing,
            startPoint: this.startPoint,
            endPoint: endPoint
        });
        
        // Reset
        this.currentDrawing = null;
        this.startPoint = null;
        this.setDrawingMode(null);
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('drawingComplete'));
    }
    
    createDrawingElement(type) {
        let element;
        
        switch (type) {
            case 'trendline':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                element.setAttribute('stroke', '#2196F3');
                element.setAttribute('stroke-width', '2');
                break;
                
            case 'horizontal':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                element.setAttribute('stroke', '#FF9800');
                element.setAttribute('stroke-width', '2');
                element.setAttribute('stroke-dasharray', '5,5');
                break;
                
            case 'vertical':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                element.setAttribute('stroke', '#9C27B0');
                element.setAttribute('stroke-width', '2');
                element.setAttribute('stroke-dasharray', '5,5');
                break;
                
            case 'rectangle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                element.setAttribute('fill', 'rgba(76, 175, 80, 0.1)');
                element.setAttribute('stroke', '#4CAF50');
                element.setAttribute('stroke-width', '2');
                break;
        }
        
        return element;
    }
    
    updateDrawing(element, start, end) {
        const type = this.drawingMode;
        
        switch (type) {
            case 'trendline':
                element.setAttribute('x1', start.x);
                element.setAttribute('y1', start.y);
                element.setAttribute('x2', end.x);
                element.setAttribute('y2', end.y);
                break;
                
            case 'horizontal':
                element.setAttribute('x1', 0);
                element.setAttribute('y1', start.y);
                element.setAttribute('x2', this.container.clientWidth);
                element.setAttribute('y2', start.y);
                break;
                
            case 'vertical':
                element.setAttribute('x1', start.x);
                element.setAttribute('y1', 0);
                element.setAttribute('x2', start.x);
                element.setAttribute('y2', this.container.clientHeight);
                break;
                
            case 'rectangle':
                const x = Math.min(start.x, end.x);
                const y = Math.min(start.y, end.y);
                const width = Math.abs(end.x - start.x);
                const height = Math.abs(end.y - start.y);
                
                element.setAttribute('x', x);
                element.setAttribute('y', y);
                element.setAttribute('width', width);
                element.setAttribute('height', height);
                break;
        }
    }
    
    clearAll() {
        this.drawings.forEach(drawing => {
            if (drawing.element && drawing.element.parentNode) {
                this.svgOverlay.removeChild(drawing.element);
            }
        });
        this.drawings = [];
    }
    
    undo() {
        if (this.drawings.length > 0) {
            const lastDrawing = this.drawings.pop();
            if (lastDrawing.element && lastDrawing.element.parentNode) {
                this.svgOverlay.removeChild(lastDrawing.element);
            }
        }
    }
    
    getDrawingCount() {
        return this.drawings.length;
    }
}
