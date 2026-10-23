import React, { useRef, useEffect } from 'react';
import { BoardSize, PlayerSymbol, WinningLine, SymbolPack } from '../types';
import { ThemeConfig } from '../utils/themeConfig';

interface GameBoardProps {
  board: (PlayerSymbol | null)[];
  size: BoardSize;
  onCellClick: (index: number) => void;
  winningLine: WinningLine | null;
  currentTurn: PlayerSymbol;
  disabled: boolean;
  theme: ThemeConfig;
  symbolPack: SymbolPack;
  hintCell: number | null;
  lastMoveIndex: number | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  size,
  onCellClick,
  winningLine,
  currentTurn,
  disabled,
  theme,
  symbolPack,
  hintCell,
  lastMoveIndex,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Grid styling based on dimensions
  const gridColsClass =
    size === 3 ? 'grid-cols-3' : size === 4 ? 'grid-cols-4' : 'grid-cols-5';

  const cellDimensionsClass =
    size === 3
      ? 'h-24 sm:h-28 md:h-32 text-4xl sm:text-5xl md:text-6xl'
      : size === 4
      ? 'h-18 sm:h-22 md:h-24 text-3xl sm:text-4xl md:text-5xl'
      : 'h-14 sm:h-18 md:h-20 text-2xl sm:text-3xl md:text-4xl';

  // Keyboard navigation handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    const row = Math.floor(index / size);
    const col = index % size;

    if (e.key === 'ArrowRight' && col < size - 1) nextIndex = index + 1;
    else if (e.key === 'ArrowLeft' && col > 0) nextIndex = index - 1;
    else if (e.key === 'ArrowDown' && row < size - 1) nextIndex = index + size;
    else if (e.key === 'ArrowUp' && row > 0) nextIndex = index - size;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && board[index] === null) {
        onCellClick(index);
      }
      return;
    }

    if (nextIndex >= 0 && containerRef.current) {
      e.preventDefault();
      const nextBtn = containerRef.current.querySelector<HTMLButtonElement>(
        `[data-cell-index="${nextIndex}"]`
      );
      nextBtn?.focus();
    }
  };

  // Keyboard shortcut listener for numpad 1-9 (classic 3x3 layout)
  useEffect(() => {
    if (size !== 3 || disabled) return;

    const onGlobalKey = (e: KeyboardEvent) => {
      // Map standard numpad:
      // 7 8 9 -> 0 1 2
      // 4 5 6 -> 3 4 5
      // 1 2 3 -> 6 7 8
      const numpadMap: Record<string, number> = {
        '7': 0, '8': 1, '9': 2,
        '4': 3, '5': 4, '6': 5,
        '1': 6, '2': 7, '3': 8,
      };

      if (e.key in numpadMap && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const targetCell = numpadMap[e.key];
        if (board[targetCell] === null) {
          onCellClick(targetCell);
        }
      }
    };

    window.addEventListener('keydown', onGlobalKey);
    return () => window.removeEventListener('keydown', onGlobalKey);
  }, [size, disabled, board, onCellClick]);

  const isWinningCell = (idx: number) => {
    return winningLine ? winningLine.indices.includes(idx) : false;
  };

  const getSymbolRender = (val: PlayerSymbol | null) => {
    if (!val) return null;
    return val === 'X' ? symbolPack.xIcon : symbolPack.oIcon;
  };

  const getSymbolStyle = (val: PlayerSymbol | null) => {
    if (val === 'X') {
      return `${theme.accentP1.text} drop-shadow-[0_0_12px_${theme.accentP1.color}66]`;
    }
    if (val === 'O') {
      return `${theme.accentP2.text} drop-shadow-[0_0_12px_${theme.accentP2.color}66]`;
    }
    return '';
  };

  return (
    <div className="relative mx-auto w-full max-w-md select-none p-3 sm:p-5">
      {/* Outer arena frame */}
      <div
        ref={containerRef}
        role="grid"
        aria-label={`Tic Tac Toe ${size} by ${size} game board`}
        className={`relative grid ${gridColsClass} gap-2.5 sm:gap-3 rounded-2xl p-3 sm:p-4 transition-all duration-300 ${
          theme.isDark
            ? 'bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/60'
            : 'bg-white border border-slate-300 shadow-xl shadow-slate-200'
        }`}
      >
        {board.map((cellValue, idx) => {
          const isWin = isWinningCell(idx);
          const isHint = hintCell === idx;
          const isLastMove = lastMoveIndex === idx;
          const isEmpty = cellValue === null;

          return (
            <button
              key={idx}
              data-cell-index={idx}
              role="gridcell"
              aria-label={`Cell ${idx + 1}, ${
                cellValue ? `contains ${cellValue}` : isHint ? 'Recommended move' : 'Empty'
              }`}
              tabIndex={disabled ? -1 : 0}
              disabled={disabled || !isEmpty}
              onClick={() => onCellClick(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`group relative flex items-center justify-center rounded-xl font-display font-extrabold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${cellDimensionsClass} ${
                isEmpty
                  ? theme.isDark
                    ? 'bg-slate-800/40 hover:bg-slate-800/80 active:scale-95 border border-slate-800 hover:border-slate-700'
                    : 'bg-slate-50 hover:bg-slate-100 active:scale-95 border border-slate-200 hover:border-slate-300'
                  : theme.isDark
                  ? 'bg-slate-800/80 border border-slate-700/80'
                  : 'bg-slate-100 border border-slate-300'
              } ${
                isWin
                  ? cellValue === 'X'
                    ? `${theme.accentP1.bg} ${theme.accentP1.border} ${theme.accentP1.glow} ring-2 ring-cyan-400 scale-[1.02] z-10`
                    : `${theme.accentP2.bg} ${theme.accentP2.border} ${theme.accentP2.glow} ring-2 ring-rose-400 scale-[1.02] z-10`
                  : ''
              } ${
                isHint && isEmpty
                  ? 'ring-2 ring-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.35)] animate-pulse'
                  : ''
              } ${
                isLastMove && !isWin
                  ? 'ring-1 ring-slate-400/50'
                  : ''
              }`}
            >
              {/* Existing Placed Symbol */}
              {cellValue && (
                <span
                  className={`inline-block transform transition-transform duration-200 scale-100 ${getSymbolStyle(
                    cellValue
                  )} animate-in zoom-in-50 duration-150`}
                >
                  {getSymbolRender(cellValue)}
                </span>
              )}

              {/* Ghost Symbol on Hover (when cell is empty & active) */}
              {isEmpty && !disabled && (
                <span
                  className={`pointer-events-none opacity-0 group-hover:opacity-30 transform group-hover:scale-90 transition-all duration-150 ${
                    currentTurn === 'X' ? theme.accentP1.text : theme.accentP2.text
                  }`}
                  aria-hidden="true"
                >
                  {currentTurn === 'X' ? symbolPack.xIcon : symbolPack.oIcon}
                </span>
              )}

              {/* Tactical Hint Marker */}
              {isHint && isEmpty && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}

              {/* Subtle Cell Coordinates for keyboard / screen reader */}
              <span className="sr-only">
                Row {Math.floor(idx / size) + 1}, Column {(idx % size) + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
