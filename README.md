# 📈 Trading Charts Application

A modern, interactive trading chart application with drawing tools built using TradingView's Lightweight Charts library. This application allows users to visualize candlestick data and draw various technical analysis tools on the chart.

## ✨ Features

- **Interactive Candlestick Charts**: Real-time visualization of OHLC (Open, High, Low, Close) data
- **Drawing Tools**:
  - 📏 Trendline: Draw diagonal lines to identify trends
  - ➖ Horizontal Line: Mark support/resistance levels
  - | Vertical Line: Mark important time points
  - ▭ Rectangle: Highlight chart regions
- **Drawing Management**:
  - Clear all drawings at once
  - Undo last drawing
  - Track number of active drawings
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with gradient styling

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd trading-charts-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎮 How to Use

1. **Select a Drawing Tool**: Click on any tool button in the toolbar (Trendline, Horizontal, Vertical, or Rectangle)
2. **Draw on Chart**: 
   - For lines: Click once for the start point, then click again for the end point
   - For rectangles: Click and drag to define the area
3. **Manage Drawings**:
   - **Undo**: Remove the last drawing
   - **Clear All**: Remove all drawings from the chart
4. **View Information**: The info bar shows the current active tool and number of drawings

## 📁 Project Structure

```
trading-charts-app/
├── index.html           # Main HTML file
├── style.css            # Application styles
├── main.js              # Main application logic
├── drawingManager.js    # Drawing tools implementation
├── package.json         # Project dependencies
└── README.md           # This file
```

## 🛠️ Technologies Used

- **[Lightweight Charts](https://tradingview.github.io/lightweight-charts/)**: TradingView's lightweight charting library
- **Vanilla JavaScript**: ES6+ modules
- **SVG**: For drawing overlays
- **Vite**: Fast development server and build tool

## 📊 Sample Data

The application generates random candlestick data for demonstration purposes. In a real-world scenario, you would replace this with actual market data from an API.

## 🎨 Customization

### Adding New Drawing Tools

1. Add a new button in `index.html`
2. Implement the drawing logic in `drawingManager.js`
3. Add the tool selection handler in `main.js`

### Styling

Modify `style.css` to customize colors, sizes, and layout. The application uses CSS variables for easy theming.

### Chart Configuration

Edit the chart options in `main.js` to customize:
- Colors
- Grid lines
- Price scale
- Time scale
- Candlestick colors

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📚 Resources

- [Lightweight Charts Documentation](https://tradingview.github.io/lightweight-charts/docs)
- [TradingView Lightweight Charts GitHub](https://github.com/tradingview/lightweight-charts)

## 🔮 Future Enhancements

- [ ] Add more drawing tools (Fibonacci retracement, channels, etc.)
- [ ] Implement drawing editing/deletion
- [ ] Save/load drawings
- [ ] Real-time data integration
- [ ] Multiple timeframes
- [ ] Technical indicators
- [ ] Export chart as image
- [ ] Dark mode

## 👨‍💻 Author

Jivesh

---

Happy Trading! 📈✨
