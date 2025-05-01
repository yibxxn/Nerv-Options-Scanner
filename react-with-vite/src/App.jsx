// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TickerTape from './components/Tickertape';
import Home from './pages/Home';
import NotableScanner from './pages/NotableScanner';
import OptionsChain from './pages/OptionsChain';
import WatchList from './pages/WatchList';
import './App.css';
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="mt-20 p-4">
      <TickerTape />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notable" element={<NotableScanner />} />
          <Route path="/chain" element={<OptionsChain />} />
          <Route path="/watchlist" element={<WatchList />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
