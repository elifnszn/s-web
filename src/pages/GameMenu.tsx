// src/pages/GameMenu.tsx
import { useNavigate } from 'react-router-dom';
import catImg from "../assets/cat.png";
import homeImg from "../assets/home.png";
import kolayImg from "../assets/kolay.png";
import ortaImg from "../assets/orta.png";
import zorImg from "../assets/zor.png";

export function GameMenu() {
  const navigate = useNavigate();

  const startGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigate(`/game?difficulty=${difficulty}`);
  };

  return (
    <div
      className="w-screen h-screen bg-[#272624] relative overflow-hidden"
      style={{ minWidth: "800px", minHeight: "600px" }}
    >
      {/* Kedi */}
      <img
        src={catImg}
        alt="Cat"
        className="absolute bottom-0 left-0"
        style={{ width: "300px", height: "auto" }}
      />

      {/* Zorluk Seçim Görselleri */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        style={{ top: "120px", gap: "32px" }}
      >
        <img
          src={kolayImg}
          alt="Kolay"
          onClick={() => startGame('easy')}
          style={{ width: "250px", height: "85px", cursor: "pointer" }}
        />
        <img
          src={ortaImg}
          alt="Orta"
          onClick={() => startGame('medium')}
          style={{ width: "250px", height: "85px", cursor: "pointer" }}
        />
        <img
          src={zorImg}
          alt="Zor"
          onClick={() => startGame('hard')}
          style={{ width: "250px", height: "85px", cursor: "pointer" }}
        />
      </div>

      {/* Ana Sayfa Butonu */}
      <img
        src={homeImg}
        alt="Ana Sayfa"
        onClick={() => navigate('/')}
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ bottom: "200px", width: "88px", height: "88px", cursor: "pointer" }}
      />
    </div>
  );
}
