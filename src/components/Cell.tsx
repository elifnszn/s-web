// src/components/Cell.tsx
import React, { useRef } from 'react';
import type { CellType } from '../types/CellType';

interface Props {
  cell: CellType;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Cell: React.FC<Props> = ({ cell, onClick, onRightClick }) => {
  const timerRef = useRef<number | null>(null);
  const touchHandledRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchHandledRef.current = false;
    timerRef.current = window.setTimeout(() => {
      touchHandledRef.current = true;
      // Sağ tıklama yerine geçmesi için fake MouseEvent oluşturulamaz, bu yüzden özel işaretleme yapılmaz
      onRightClick({
        ...e as any,
        preventDefault: () => {},
        nativeEvent: {
          ...e.nativeEvent,
          button: 2
        }
      } as unknown as React.MouseEvent<HTMLDivElement>);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!touchHandledRef.current) {
      onClick();
    }
  };

  const baseClass = 'w-8 h-8 border text-sm flex items-center justify-center cursor-pointer select-none ';
  const revealedClass = cell.isRevealed ? 'bg-white ' : 'bg-gray-300 hover:bg-gray-400 ';
  const mineClass = cell.isRevealed && cell.isMine ? 'bg-red-600 text-white ' : '';
  const flagClass = cell.isFlagged ? 'text-red-600 ' : '';
  const textColorClasses = [
    'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600',
    'text-indigo-600', 'text-yellow-600', 'text-pink-600', 'text-gray-600',
  ];

  let numberColor = '';
  if (cell.adjacentMines > 0) {
    numberColor = textColorClasses[Math.min(cell.adjacentMines - 1, 7)];
  }

  return (
    <div
      className={baseClass + revealedClass + mineClass + flagClass}
      onClick={onClick}
      onContextMenu={onRightClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      aria-label={`Cell ${cell.x},${cell.y}`}
    >
      {cell.isFlagged && !cell.isRevealed ? '🚩' : ''}
      {cell.isRevealed && cell.isMine ? '💣' : ''}
      {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 ? (
        <span className={numberColor}>{cell.adjacentMines}</span>
      ) : null}
    </div>
  );
};
