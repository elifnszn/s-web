// src/components/Board.tsx
import React, { useEffect, useState } from 'react';
import { Cell } from './Cell';
import type { CellType } from '../types/CellType';

interface BoardProps {
  rows: number;
  cols: number;
  mines: number;
  onGameOver: () => void;
  onFirstClick: () => void;
  onWin?: () => void;
  setFlagsLeft?: (count: number) => void;
  setTimerRunning?: (running: boolean) => void;
}

export const Board: React.FC<BoardProps> = ({
  rows,
  cols,
  mines,
  onGameOver,
  onFirstClick,
  onWin,
  setFlagsLeft,
  setTimerRunning,
}) => {
  const [board, setBoard] = useState<CellType[][]>([]);
  const [firstClick, setFirstClick] = useState(false);
  const [flags, setFlags] = useState(0);

  useEffect(() => {
    resetBoard();
  }, [rows, cols, mines]);

  const resetBoard = () => {
    const emptyBoard = Array.from({ length: rows }, (_, y) =>
      Array.from({ length: cols }, (_, x) => ({
        x,
        y,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );
    setBoard(emptyBoard);
    setFirstClick(false);
    setFlags(0);
    setFlagsLeft?.(mines);
    setTimerRunning?.(false);
  };

  const placeMinesAndReveal = (sx: number, sy: number) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let placed = 0;
    while (placed < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (!newBoard[y][x].isMine && !(x === sx && y === sy)) {
        newBoard[y][x].isMine = true;
        placed++;
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!newBoard[y][x].isMine) {
          newBoard[y][x].adjacentMines = countAdjacentMines(newBoard, x, y);
        }
      }
    }
    setBoard(newBoard);
    revealSafeArea(sx, sy, newBoard);
    setBoard([...newBoard]);
  };

  const countAdjacentMines = (grid: CellType[][], x: number, y: number): number => {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 &&
          nx < cols &&
          ny >= 0 &&
          ny < rows &&
          !(dx === 0 && dy === 0) &&
          grid[ny][nx].isMine
        ) {
          count++;
        }
      }
    }
    return count;
  };

  const revealSafeArea = (x: number, y: number, grid: CellType[][]) => {
    const stack = [{ x, y }];
    const visited = new Set<string>();

    while (stack.length) {
      const { x, y } = stack.pop()!;
      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const cell = grid[y][x];
      if (cell.isFlagged || cell.isRevealed) continue;
      cell.isRevealed = true;

      if (cell.adjacentMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              stack.push({ x: nx, y: ny });
            }
          }
        }
      }
    }
  };

  const handleClick = (x: number, y: number) => {
    if (!firstClick) {
      setFirstClick(true);
      onFirstClick();
      setTimerRunning?.(true);
      placeMinesAndReveal(x, y);
      return;
    }
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[y][x];
    if (cell.isFlagged || cell.isRevealed) return;

    if (cell.isMine) {
      cell.isRevealed = true;
      revealAllMines(newBoard);
      setBoard(newBoard);
      onGameOver();
      setTimerRunning?.(false);
    } else {
      revealSafeArea(x, y, newBoard);
      setBoard(newBoard);
      checkWin(newBoard);
    }
  };

  const revealAllMines = (grid: CellType[][]) => {
    for (let row of grid) {
      for (let cell of row) {
        if (cell.isMine) cell.isRevealed = true;
      }
    }
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    x: number,
    y: number
  ) => {
    e.preventDefault?.();
    if (!firstClick) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const cell = newBoard[y][x];
    if (cell.isRevealed) return;

    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlags(f => {
        setFlagsLeft?.(f - 1);
        return f - 1;
      });
    } else {
      if (flags < mines) {
        cell.isFlagged = true;
        setFlags(f => {
          setFlagsLeft?.(f + 1);
          return f + 1;
        });
      }
    }
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const checkWin = (grid: CellType[][]) => {
    for (let row of grid) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) return;
      }
    }
    onWin?.();
    setTimerRunning?.(false);
  };

  return (
    <div
      className="grid gap-[2px] bg-black p-1 mx-auto"
      style={{
        gridTemplateRows: `repeat(${rows}, 30px)`,
        gridTemplateColumns: `repeat(${cols}, 30px)`
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <Cell
            key={`${x}-${y}`}
            cell={cell}
            onClick={() => handleClick(x, y)}
            onRightClick={(e) => handleRightClick(e, x, y)}
          />
        ))
      )}
    </div>
  );
};
