import { useEffect, useState, useMemo } from 'react';
import { Board } from "../components/Board";
import { useNavigate, useLocation } from 'react-router-dom';
import type { Difficulty } from "../types/Difficulty";
import homeImg from "../assets/home.png";

export function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDifficulty = queryParams.get('difficulty') as Difficulty | null;

  const [difficulty, setDifficulty] = useState<Difficulty | null>(initialDifficulty);
  const [customSettings, setCustomSettings] = useState({ rows: 9, cols: 9, mines: 10 });

  const [flagsLeft, setFlagsLeft] = useState(customSettings.mines); // ✅ İlk değer doğru atandı
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [key, setKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [customInput, setCustomInput] = useState({
    rows: customSettings.rows.toString(),
    cols: customSettings.cols.toString(),
    mines: customSettings.mines.toString(),
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (difficulty) {
      resetGame(difficulty);
    }
  }, [difficulty]);

  const resetGame = (mode: Difficulty) => {
    let newSettings = customSettings;

    if (mode === 'easy') {
      newSettings = { rows: 9, cols: 9, mines: 10 };
    } else if (mode === 'medium') {
      newSettings = { rows: 16, cols: 16, mines: 40 };
    } else if (mode === 'hard') {
      newSettings = { rows: 16, cols: 30, mines: 99 };
    } else if (mode === 'custom') {
      const rows = parseInt(customInput.rows, 10);
      const cols = parseInt(customInput.cols, 10);
      const mines = parseInt(customInput.mines, 10);
      if (!isNaN(rows) && !isNaN(cols) && !isNaN(mines)) {
        newSettings = { rows, cols, mines };
      }
    }

    setCustomSettings(newSettings);
    setFlagsLeft(newSettings.mines); // ✅ doğru sayaç başlatma

    setElapsedTime(0);
    setStartTime(null);
    setTimerRunning(false);
    setKey(prev => prev + 1);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (timerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  const handleFirstClick = () => {
    if (startTime === null && !gameOver && !gameWon) {
      setStartTime(Date.now());
      setTimerRunning(true);
    }
  };

  const onGameOver = () => {
    setGameOver(true);
    setTimerRunning(false);
  };

  const onWin = () => {
    setGameWon(true);
    setTimerRunning(false);
  };

  const handleStartCustomGameClick = () => {
    if (difficulty === 'custom') {
      resetGame('custom');
    } else {
      setDifficulty('custom');
      setErrorMsg('');
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setCustomInput(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateCustomGame = () => {
    const rows = parseInt(customInput.rows, 10);
    const cols = parseInt(customInput.cols, 10);
    const mines = parseInt(customInput.mines, 10);

    if (
      isNaN(rows) || rows < 5 || rows > 40 ||
      isNaN(cols) || cols < 5 || cols > 40 ||
      isNaN(mines) || mines < 1 || mines >= rows * cols
    ) {
      setErrorMsg('Lütfen geçerli değerler giriniz. Satır ve sütun 5-40 arası, mayın sayısı 1 ile satır*sütun-1 arası olmalı.');
      return;
    }

    const newCustom = { rows, cols, mines };
    setCustomSettings(newCustom);
    setFlagsLeft(mines); // ✅ özel modda da doğru sayaç
    setErrorMsg('');
    setKey(prev => prev + 1);
    setStartTime(null);
    setElapsedTime(0);
    setTimerRunning(false);
    setGameOver(false);
    setGameWon(false);
  };

  const rows = customSettings.rows;
  const cols = customSettings.cols;
  const mines = customSettings.mines;

  const mineDisplay = useMemo(() => {
    return customSettings.mines - flagsLeft;
  }, [customSettings.mines, flagsLeft]); // ✅ birlikte güncellenir, yanlış göstermez

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col items-center justify-start">
      {/* Üst Menü */}
      <div className="flex justify-center space-x-4 mt-4 text-sm items-center">
        {['easy', 'medium', 'hard'].map(mode => (
          <button
            key={mode}
            onClick={() => {
              if (difficulty === mode) resetGame(mode as Difficulty);
              else setDifficulty(mode as Difficulty);
            }}
            className={`hover:underline capitalize ${difficulty === mode ? 'text-yellow-300' : ''}`}
          >
            {mode === 'easy' ? 'Kolay' : mode === 'medium' ? 'Orta' : 'Zor'}
          </button>
        ))}
        <button onClick={handleStartCustomGameClick} className={`hover:underline ${difficulty === 'custom' ? 'text-yellow-300' : ''}`}>Özel</button>
        <button onClick={() => navigate('/')}> <img src={homeImg} alt="Home" style={{ width: '32px', height: '32px' }} /></button>
      </div>

      {/* Sayaçlar */}
      {difficulty && (
        <div className="flex justify-between items-center w-full max-w-5xl px-4 mt-4 mb-4">
          <div className="bg-white text-black shadow px-4 py-2 rounded text-lg">🧨 {mineDisplay}</div>
          <button onClick={() => resetGame(difficulty)} className="text-2xl">🙂</button>
          <div className="bg-white text-black shadow px-4 py-2 rounded text-lg">⏱️ {elapsedTime}s</div>
        </div>
      )}

      {/* Özel mod ayarları */}
      {difficulty === 'custom' && (
        <div className="mb-4 bg-white text-black p-4 rounded shadow max-w-5xl w-full">
          <div className="flex gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm">Genişlik</label>
              <input type="text" name="cols" value={customInput.cols} onChange={handleCustomInputChange} className="border rounded p-1 w-24" maxLength={2} inputMode="numeric" pattern="[0-9]*" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Yükseklik</label>
              <input type="text" name="rows" value={customInput.rows} onChange={handleCustomInputChange} className="border rounded p-1 w-24" maxLength={2} inputMode="numeric" pattern="[0-9]*" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Mayın</label>
              <input type="text" name="mines" value={customInput.mines} onChange={handleCustomInputChange} className="border rounded p-1 w-24" maxLength={3} inputMode="numeric" pattern="[0-9]*" />
            </div>
            <button onClick={handleCreateCustomGame} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded h-10">Oluştur</button>
          </div>
          {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
        </div>
      )}

      {/* Oyun Alanı */}
      {difficulty && (
        <div className="overflow-auto">
          <Board
            key={key}
            rows={rows}
            cols={cols}
            mines={mines}
            onGameOver={onGameOver}
            onFirstClick={handleFirstClick}
            onWin={onWin}
            setFlagsLeft={setFlagsLeft}
            setTimerRunning={setTimerRunning}
            disabled={gameOver || gameWon}
          />
        </div>
      )}

      {/* Uyarı Mesajı */}
      {(gameOver || gameWon) && (
        <div className="bg-yellow-300 text-black px-4 py-2 rounded shadow mt-4 text-center">
          <h2 className="text-lg font-semibold">
            {gameOver ? 'Mayına Bastın! 😵' : `Kazandın! 🎉 Süre: ${elapsedTime}s`}
          </h2>
          <button
            onClick={() => resetGame(difficulty!)}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
          >
            Yeniden Oyna
          </button>
        </div>
      )}
    </div>
  );
}
