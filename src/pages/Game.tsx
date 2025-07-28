import { useEffect, useState } from 'react';
import { Board } from "../components/Board";
import { useNavigate } from 'react-router-dom';
import type { Difficulty } from "../types/Difficulty";

export function Game() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [customSettings, setCustomSettings] = useState({ rows: 9, cols: 9, mines: 10 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [key, setKey] = useState(0);
  const [customInput, setCustomInput] = useState({
    rows: customSettings.rows.toString(),
    cols: customSettings.cols.toString(),
    mines: customSettings.mines.toString(),
  });
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleStartCustomGameClick = () => {
    setDifficulty('custom');
    setErrorMsg('');
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

    setCustomSettings({ rows, cols, mines });
    setErrorMsg('');
    setKey(prev => prev + 1);
    setStartTime(null);
    setElapsedTime(0);
    setTimerRunning(false);
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
    if (startTime === null) {
      setStartTime(Date.now());
      setTimerRunning(true);
    }
  };

  const onGameOver = () => {
    alert('Mayına bastın! 😵');
    setTimerRunning(false);
  };

  const onWin = () => {
    alert(`Kazandın! ⏱️ Süre: ${elapsedTime}s`);
    setTimerRunning(false);
  };

  const resetGame = () => {
    setElapsedTime(0);
    setStartTime(null);
    setTimerRunning(false);
    setKey(prev => prev + 1);
  };

  let rows = 9, cols = 9, mines = 10;
  if (difficulty === 'medium') {
    rows = 16;
    cols = 16;
    mines = 40;
  } else if (difficulty === 'hard') {
    rows = 16;
    cols = 30;
    mines = 99;
  } else if (difficulty === 'custom') {
    rows = customSettings.rows;
    cols = customSettings.cols;
    mines = customSettings.mines;
  }

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col items-center justify-start">
      {/* Üst menü */}
      <div className="flex justify-center space-x-4 mt-4 text-sm">
        <button onClick={() => setDifficulty('easy')} className="hover:underline">Kolay</button>
        <button onClick={() => setDifficulty('medium')} className="hover:underline">Orta</button>
        <button onClick={() => setDifficulty('hard')} className="hover:underline">Zor</button>
        <button onClick={handleStartCustomGameClick} className="hover:underline">Özel</button>
        <button onClick={resetGame} className="text-2xl">🙂</button>
        <button onClick={() => navigate('/')} className="text-blue-400 hover:underline">Ana Sayfa</button>
      </div>

      {/* Sayaçlar */}
      {difficulty && (
        <div className="flex justify-between items-center w-full max-w-5xl px-4 mt-4 mb-4">
          <div className="bg-white text-black shadow px-4 py-2 rounded text-lg">🚩 {mines - flagsLeft}</div>
          <button onClick={resetGame} className="text-2xl">🙂</button>
          <div className="bg-white text-black shadow px-4 py-2 rounded text-lg">⏱️ {elapsedTime}s</div>
        </div>
      )}

      {/* Özel mod formu */}
      {difficulty === 'custom' && (
        <div className="mb-4 bg-white text-black p-4 rounded shadow max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Özel Oyun Ayarları</h3>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <label className="flex flex-col">
              Genişlik (Sütun):
              <input
                type="text"
                name="cols"
                value={customInput.cols}
                onChange={handleCustomInputChange}
                className="border rounded p-1 mt-1"
                maxLength={2}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="örn: 9"
              />
            </label>
            <label className="flex flex-col">
              Yükseklik (Satır):
              <input
                type="text"
                name="rows"
                value={customInput.rows}
                onChange={handleCustomInputChange}
                className="border rounded p-1 mt-1"
                maxLength={2}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="örn: 9"
              />
            </label>
            <label className="flex flex-col col-span-2">
              Mayın Sayısı:
              <input
                type="text"
                name="mines"
                value={customInput.mines}
                onChange={handleCustomInputChange}
                className="border rounded p-1 mt-1 w-full"
                maxLength={3}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="örn: 10"
              />
            </label>
          </div>
          {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
          <button
            onClick={handleCreateCustomGame}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Oluştur
          </button>
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
          />
        </div>
      )}
    </div>
  );
}
