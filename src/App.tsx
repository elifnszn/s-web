import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Game } from './pages/Game';
import Home from './pages/Home';
import Message from './pages/Message';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/message" element={<Message />} /> {/* 🎉 Yeni route */}
      </Routes>
    </Router>
  );
}

export default App;
