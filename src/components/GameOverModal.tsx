import React from 'react';
import { PlayerSymbol, GameMode, AIDifficulty, SymbolPack } from '../types';
import { Trophy, Frown, Equal, RotateCcw, Eye, Flame } from 'lucide-react';
import { ThemeConfig } from '../utils/themeConfig';

interface GameOverModalProps {
  isOpen: boolean;
  winner: PlayerSymbol | 'draw' | null;
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  player1Name: string;
  player2Name: string;
  movesCount: number;
  durationSeconds: number;
  streak: number;
  theme: ThemeConfig;
  symbolPack: SymbolPack;
  onRematch: () => void;
  onReview: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  mode,
  aiDifficulty,
  player1Name,
  player2Name,
  movesCount,
  durationSeconds,
  streak,
  theme,
  symbolPack,
  onRematch,
  onReview,
  onClose,
}) => {
  if (!isOpen || !winner) return null;

  const isPlayer1Win = winner === 'X';
  const isPlayer2Win = winner === 'O';
  const isDraw = winner === 'draw';

  // In vs-ai mode: P1 is Human, P2 is AI. So P1 win = Victory, P2 win = Defeat
  const isHumanVictory = mode === 'vs-ai' ? isPlayer1Win : isPlayer1Win || isPlayer2Win;
  const isHumanDefeat = mode === 'vs-ai' && isPlayer2Win;

  const getWinnerName = () => {
    if (isDraw) return 'Neither Player';
    if (winner === 'X') return player1Name;
    return mode === 'vs-ai' ? 'Computer AI' : player2Name;
  };

  const getHeading = () => {
    if (isDraw) return 'Match Drawn';
    if (mode === 'vs-ai') {
      return isPlayer1Win ? 'Victory!' : 'Defeat!';
    }
    return `${getWinnerName()} Won!`;
  };

  const getSubheading = () => {
    if (isDraw) {
      return 'Every square was fiercely contested. Neither side yielded an inch.';
    }
    if (mode === 'vs-ai') {
      if (isPlayer1Win) {
        return aiDifficulty === 'master'
          ? 'Legendary play! You outplayed the Master Minimax engine.'
          : 'Flawless execution! You secured the winning line.';
      } else {
        return 'The computer calculated the optimal tactic. Dust off your strategy and strike back!';
      }
    }
    return `Masterful victory by ${getWinnerName()} with a decisive tactical line.`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 sm:p-7 border shadow-2xl transition-all ${
          theme.isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-cyan-950/40'
            : 'bg-white border-slate-300 text-slate-900 shadow-slate-400/40'
        }`}
      >
        {/* Outcome Header Banner */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 shadow-inner">
            {isDraw ? (
              <div className="w-14 h-14 rounded-full bg-slate-500/20 text-slate-300 flex items-center justify-center">
                <Equal className="w-8 h-8" />
              </div>
            ) : isHumanVictory ? (
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Frown className="w-8 h-8" />
              </div>
            )}
          </div>

          <h2 id="game-over-title" className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            {getHeading()}
          </h2>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            {getSubheading()}
          </p>
        </div>

        {/* Win Streak Indicator if relevant */}
        {streak > 1 && isHumanVictory && mode === 'vs-ai' && (
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{streak} Match Winning Streak!</span>
          </div>
        )}

        {/* Match Statistics Matrix */}
        <div
          className={`mt-6 rounded-xl p-3.5 border grid grid-cols-3 gap-2 text-center ${
            theme.isDark
              ? 'bg-slate-800/50 border-slate-700/60'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-400">Winner</span>
            <span className="text-base font-bold font-display truncate block mt-0.5">
              {isDraw ? 'Stalemate' : winner === 'X' ? symbolPack.xIcon : symbolPack.oIcon}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-400">Moves</span>
            <span className="text-base font-bold font-mono tabular-nums block mt-0.5">
              {movesCount}
            </span>
          </div>
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-400">Duration</span>
            <span className="text-base font-bold font-mono tabular-nums block mt-0.5">
              {durationSeconds}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRematch}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:scale-98 transition-all shadow-lg shadow-cyan-400/20 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            Rematch Now
          </button>

          <button
            onClick={onReview}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap border ${
              theme.isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            Review Game
          </button>
        </div>

        {/* Dismiss Button */}
        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close & Inspect Final Board
          </button>
        </div>
      </div>
    </div>
  );
};
