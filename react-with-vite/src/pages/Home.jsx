import { useEffect, useRef } from 'react';

export default function Home() {
  const heatmapRef = useRef(null);

  // Stock Heatmap
  useEffect(() => {
    heatmapRef.current.innerHTML = '';
    const heatmapScript = document.createElement('script');
    heatmapScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    heatmapScript.type = 'text/javascript';
    heatmapScript.async = true;
    heatmapScript.innerHTML = `
      {
        "exchanges": [],
        "dataSource": "SPX500",
        "grouping": "sector",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "500"
      }`;
    heatmapRef.current.appendChild(heatmapScript);
  }, []);

  return (
    <div>

      {/* Heatmap */}
      <div className="tradingview-widget-container" ref={heatmapRef}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}
