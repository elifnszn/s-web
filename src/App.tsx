// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Game } from './pages/Game';
import { GameMenu } from './pages/GameMenu'; // ✅ GameMenu import edildi
import Home from './pages/Home';
import Message from './pages/Message';

function App() {
  return (
    <Router basename="/s-web/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/gamemenu" element={<GameMenu />} /> {/* ✅ GameMenu route'u eklendi */}
        <Route path="/message" element={<Message />} />
      </Routes>
    </Router>
  );
}

export default App;
