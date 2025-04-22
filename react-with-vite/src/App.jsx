import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [stockData, setStockData] = useState([]);
  const [ticker, setTicker] = useState("INTC");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = [...stockData].sort((a, b) => {
    if (sortConfig.key === 'premium') {
      const aPremium = a.volume * ((a.bid + a.ask) / 2) * 100;
      const bPremium = b.volume * ((b.bid + b.ask) / 2) * 100;

      return sortConfig.direction === 'asc'
        ? aPremium - bPremium
        : bPremium - aPremium;
    }
    return 0; // Default no sorting
  });

  const fetchUnusual = async (symbol) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/unusual?ticker=${symbol}`);
      setStockData(response.data.unusualOptions);
    } catch (error) {
      console.error("Error fetching unusual options:", error);
      setStockData([]); // Clear the table if error
    }
  };

  useEffect(() => {
    fetchUnusual(ticker);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUnusual(ticker);
  };

  const callPremium = sortedData
  .filter(opt => opt.type.toUpperCase() === 'CALL')
  .reduce((acc, opt) => acc + opt.volume * ((opt.bid + opt.ask) / 2) * 100, 0);

const putPremium = sortedData
  .filter(opt => opt.type.toUpperCase() === 'PUT')
  .reduce((acc, opt) => acc + opt.volume * ((opt.bid + opt.ask) / 2) * 100, 0);

  return (
    <>
      <h1 className="text-3xl font-bold">Options Chain Scanner</h1>
      <br></br>
      <div className="mb-4 text-center">
  <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
    🟢 Call Premium: <span className="font-bold">${callPremium.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> &nbsp; | &nbsp;
    🔴 Put Premium: <span className="font-bold">${putPremium.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
  </p>
</div>
      <form onSubmit={handleSearch} class="max-w-md mx-auto">
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter ticker (e.g. AAPL)" required />
          <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>
      <br></br>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Strike</th>
              <th className="px-6 py-3">Expiration</th>
              <th className="px-6 py-3">Volume</th>
              <th
                className="px-6 py-3 cursor-pointer hover:underline"
                onClick={() =>
                  setSortConfig((prev) => ({
                    key: 'premium',
                    direction: prev.direction === 'asc' ? 'desc' : 'asc'
                  }))
                }
              >
                Premiums {sortConfig.key === 'premium' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-3">Open Interest</th>
              <th className="px-6 py-3">Bid</th>
              <th className="px-6 py-3">Ask</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((opt, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700">
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-white font-semibold ${opt.type.toUpperCase() === 'PUT'
                        ? 'bg-red-500'
                        : opt.type.toUpperCase() === 'CALL'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                  >
                    {opt.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">{opt.strike}</td>
                <td className="px-6 py-4">{opt.expiration}</td>
                <td className="px-6 py-4">{opt.volume}</td>
                <td className="px-6 py-4 text-green-200">
                  ${(opt.volume * ((opt.bid + opt.ask) / 2) * 100).toLocaleString()}
                </td>
                <td className="px-6 py-4">{opt.openInterest}</td>
                <td className="px-6 py-4">{opt.bid}</td>
                <td className="px-6 py-4">{opt.ask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
