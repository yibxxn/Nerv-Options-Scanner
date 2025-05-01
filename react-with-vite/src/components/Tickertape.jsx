import { useEffect, useRef } from 'react';

const TickerTape = () => {

    const tickerRef = useRef(null);

    // Ticker Tape
    useEffect(() => {
        tickerRef.current.innerHTML = '';
        const tickerScript = document.createElement('script');
        tickerScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        tickerScript.async = true;
        tickerScript.innerHTML = JSON.stringify({
            symbols: [
                { proName: "NYSE:ABBV", description: "" },
                { proName: "NASDAQ:GOOG", description: "" },
                { proName: "NYSE:PM", description: "" },
                { proName: "NYSE:NVO", description: "" },
                { proName: "NYSE:UNH", description: "" },
                { proName: "NASDAQ:INTC", description: "" }
            ],
            showSymbolLogo: true,
            isTransparent: true,
            displayMode: "adaptive",
            colorTheme: "dark",
            locale: "en"
        });
        tickerRef.current.appendChild(tickerScript);
    }, []);

    return (
        <div className="tradingview-widget-container mb-6" ref={tickerRef}></div>
    );
};

export default TickerTape;



