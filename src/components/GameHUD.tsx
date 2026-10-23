import React from 'react';
import { PlayerSymbol, GameMode, AIDifficulty, SymbolPack } from '../types';
import { ThemeConfig } from '../utils/themeConfig';

interface GameHUDProps {
  player1Name: string;
  player2Name: string;
  p1Score: number;
  p2Score: number;
  draws: number;
  currentTurn: PlayerSymbol;
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  isAiThinking: boolean;
  timeLeft: number | null; // seconds left on blitz timer
  totalTurnTime: number; // 0 if untimed
  theme: ThemeConfig;
  symbolPack: SymbolPack;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player1Name,
  player2Name,
  p1Score,
  p2Score,
  draws,
  currentTurn,
  mode,
  aiDifficulty,
  isAiThinking,
  timeLeft,
  totalTurnTime,
  theme,
  symbolPack,
}) => {
  const isP1Turn = currentTurn === 'X';
  const isP2Turn = currentTurn === 'O';

  // Calculate timer progress percentage
  const timerPercentage =
    totalTurnTime > 0 && timeLeft !== null
      ? Math.max(0, Math.min(100, (timeLeft / totalTurnTime) * 100))
      : 100;

  const isTimerUrgent = timeLeft !== null && timeLeft <= 3 && totalTurnTime > 0;

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Turn & Status Kicker */}
      <div className="flex items-center justify-between text-xs font-medium mb-3 text-slate-400">
        <div className="flex items-center gap-2">
          <span>{mode === 'vs-ai' ? 'Vs Computer' : 'Pass & Play'}</span>
          <span aria-hidden="true">·</span>
          <span>
            {mode === 'vs-ai'
              ? aiDifficulty === 'master'
                ? 'Unbeatable AI'
                : aiDifficulty === 'medium'
                ? 'Tactician AI'
                : 'Rookie AI'
              : 'Local 2P'}
          </span>
          {totalTurnTime > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className={isTimerUrgent ? 'text-rose-400 font-semibold animate-pulse' : ''}>
                {timeLeft}s Blitz
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>{draws} Draws</span>
          <span aria-hidden="true">·</span>
          <span>{p1Score + p2Score + draws} Played</span>
        </div>
      </div>

      {/* Main Players HUD Split */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 relative">
        {/* Player 1 Card */}
        <div
          className={`relative rounded-xl p-3.5 transition-all duration-200 border ${
            isP1Turn
              ? `${theme.cardBgClass} ${theme.accentP1.border} ${theme.accentP1.glow} ring-1 ring-cyan-500/50`
              : `${theme.cardBgClass} ${theme.borderClass} opacity-75`
          }`}
        >
          {/* Top Row: Symbol & Score */}
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl sm:text-3xl font-display font-extrabold ${theme.accentP1.text}`}
            >
              {symbolPack.xIcon}
            </span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums leading-none block text-slate-100">
                {p1Score}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Wins</span>
            </div>
          </div>

          {/* Player Name & Turn Status */}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold truncate text-slate-200">{player1Name}</span>
            {isP1Turn && (
              <span className="text-xs font-medium text-cyan-400 flex items-center gap-1.5 shrink-0">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Turn
              </span>
            )}
          </div>

          {/* Blitz Timer Bar for P1 */}
          {totalTurnTime > 0 && isP1Turn && (
            <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isTimerUrgent ? 'bg-rose-500' : 'bg-cyan-400'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Player 2 / AI Card */}
        <div
          className={`relative rounded-xl p-3.5 transition-all duration-200 border ${
            isP2Turn
              ? `${theme.cardBgClass} ${theme.accentP2.border} ${theme.accentP2.glow} ring-1 ring-rose-500/50`
              : `${theme.cardBgClass} ${theme.borderClass} opacity-75`
          }`}
        >
          {/* Top Row: Symbol & Score */}
          <div className="flex items-center justify-between">
            <span
              className={`text-2xl sm:text-3xl font-display font-extrabold ${theme.accentP2.text}`}
            >
              {symbolPack.oIcon}
            </span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums leading-none block text-slate-100">
                {p2Score}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Wins</span>
            </div>
          </div>

          {/* Player Name & Turn Status */}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold truncate text-slate-200">
              {mode === 'vs-ai' ? 'Computer AI' : player2Name}
            </span>
            {isP2Turn && (
              <span className="text-xs font-medium text-rose-400 flex items-center gap-1.5 shrink-0">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                {isAiThinking ? 'Thinking…' : 'Turn'}
              </span>
            )}
          </div>

          {/* Blitz Timer Bar for P2 */}
          {totalTurnTime > 0 && isP2Turn && (
            <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isTimerUrgent ? 'bg-rose-500' : 'bg-rose-400'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
