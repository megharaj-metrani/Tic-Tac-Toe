import React, { useState, useEffect } from 'react';
import { BoardSize, MoveRecord, PlayerSymbol, SymbolPack } from '../types';
import { ThemeConfig } from '../utils/themeConfig';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Play, Pause, X } from 'lucide-react';

interface GameReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  size: BoardSize;
  moves: MoveRecord[];
  winner: PlayerSymbol | 'draw' | null;
  theme: ThemeConfig;
  symbolPack: SymbolPack;
}

export const GameReviewModal: React.FC<GameReviewModalProps> = ({
  isOpen,
  onClose,
  size,
  moves,
  winner,
  theme,
  symbolPack,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(moves.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(moves.length);
      setIsPlaying(false);
    }
  }, [isOpen, moves.length]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= moves.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [isPlaying, moves.length]);

  if (!isOpen) return null;

  // Reconstruct board at current step
  const reconstructedBoard: (PlayerSymbol | null)[] = Array(size * size).fill(null);
  for (let i = 0; i < currentStep; i++) {
    const move = moves[i];
    if (move) {
      reconstructedBoard[move.index] = move.player;
    }
  }

  const lastMoveInStep = currentStep > 0 ? moves[currentStep - 1] : null;

  const gridColsClass =
    size === 3 ? 'grid-cols-3' : size === 4 ? 'grid-cols-4' : 'grid-cols-5';

  const cellDimensionsClass =
    size === 3 ? 'h-20 text-3xl' : size === 4 ? 'h-16 text-2xl' : 'h-12 text-xl';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl ${
          theme.isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h2 id="review-title" className="text-xl font-display font-bold">
              Match Move Inspector
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              <span>{moves.length} total moves</span>
              <span aria-hidden="true" className="mx-1.5">·</span>
              <span>Outcome: {winner === 'draw' ? 'Stalemate' : `${winner} Victory`}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close reviewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Move Step Commentary */}
        <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Step {currentStep} of {moves.length}
          </div>
          <div className="text-sm font-medium mt-1 text-slate-200">
            {currentStep === 0 ? (
              'Initial Empty Board'
            ) : lastMoveInStep ? (
              <span>
                Player <strong className="text-cyan-400">{lastMoveInStep.player}</strong> placed mark at
                Row {lastMoveInStep.row + 1}, Column {lastMoveInStep.col + 1}
              </span>
            ) : (
              'Final Position'
            )}
          </div>
        </div>

        {/* Board Display */}
        <div className="my-5 mx-auto max-w-xs">
          <div
            className={`grid ${gridColsClass} gap-2 rounded-xl p-3 border ${
              theme.isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            {reconstructedBoard.map((val, idx) => {
              const isLatestPlaced = lastMoveInStep?.index === idx;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-center rounded-lg font-display font-bold transition-all ${cellDimensionsClass} ${
                    val === 'X'
                      ? `${theme.accentP1.bg} ${theme.accentP1.text}`
                      : val === 'O'
                      ? `${theme.accentP2.bg} ${theme.accentP2.text}`
                      : 'bg-slate-800/30'
                  } ${isLatestPlaced ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900' : ''}`}
                >
                  {val === 'X' ? symbolPack.xIcon : val === 'O' ? symbolPack.oIcon : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            disabled={currentStep === 0}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Jump to Start"
            aria-label="Jump to Start"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.max(0, p - 1));
            }}
            disabled={currentStep === 0}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Previous Move"
            aria-label="Previous Move"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (currentStep >= moves.length) {
                setCurrentStep(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className="px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Auto-play
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.min(moves.length, p + 1));
            }}
            disabled={currentStep >= moves.length}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Next Move"
            aria-label="Next Move"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(moves.length);
            }}
            disabled={currentStep >= moves.length}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
            title="Jump to End"
            aria-label="Jump to End"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
