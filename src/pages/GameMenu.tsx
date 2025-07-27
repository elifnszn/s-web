// src/pages/GameMenu.tsx
import { useNavigate } from 'react-router-dom';

export function GameMenu() {
  const navigate = useNavigate();

  const startGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigate(`/game?difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Yeni Oyun</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Kolay */}
        <button
          onClick={() => startGame('easy')}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:scale-105 transition"
        >
          <span className="text-green-600 font-semibold mb-2">Kolay</span>
          <div className="grid grid-cols-5 gap-0.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300" />
            ))}
          </div>
        </button>

        {/* Orta */}
        <button
          onClick={() => startGame('medium')}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:scale-105 transition"
        >
          <span className="text-yellow-600 font-semibold mb-2">Orta</span>
          <div className="grid grid-cols-10 gap-0.5">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-400" />
            ))}
          </div>
        </button>

        {/* Zor */}
        <button
          onClick={() => startGame('hard')}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:scale-105 transition"
        >
          <span className="text-red-600 font-semibold mb-2">Zor</span>
          <div className="grid grid-cols-15 gap-0.5">
            {Array.from({ length: 225 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-gray-500" />
            ))}
          </div>
        </button>
      </div>

      {/* Girişe dön */}
      <button
        onClick={() => navigate('/')}
        className="mt-10 text-blue-600 underline hover:text-blue-800"
      >
        Başlangıç Ekranına Dön
      </button>
    </div>
  );
}
