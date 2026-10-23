import React, { useState } from 'react';
import { GameStats, MatchHistoryItem, SymbolPack } from '../types';
import { ThemeConfig } from '../utils/themeConfig';
import { Trophy, TrendingUp, History, Flame, Trash2, Eye } from 'lucide-react';
import { GameReviewModal } from './GameReviewModal';

interface StatsViewProps {
  stats: GameStats;
  theme: ThemeConfig;
  symbolPack: SymbolPack;
  onClearStats: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  theme,
  symbolPack,
  onClearStats,
}) => {
  const [selectedMatchForReview, setSelectedMatchForReview] = useState<MatchHistoryItem | null>(
    null
  );

  const total = stats.matchesPlayed;
  const winRate = total > 0 ? Math.round((stats.winsP1 / total) * 100) : 0;
  const drawRate = total > 0 ? Math.round((stats.draws / total) * 100) : 0;
  const lossRate = total > 0 ? Math.round((stats.winsP2orAI / total) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-200">
      {/* Title & Clear Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100">
            Player Analytics & History
          </h2>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Performance metrics</span>
            <span aria-hidden="true">·</span>
            <span>{total} matches recorded</span>
            <span aria-hidden="true">·</span>
            <span>Stored locally</span>
          </div>
        </div>

        {total > 0 && (
          <button
            onClick={onClearStats}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset Analytics
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Win Rate */}
        <div
          className={`p-4 rounded-xl border ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Win Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold font-mono tabular-nums mt-2 text-cyan-400">
            {winRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.winsP1} of {total} matches
          </div>
        </div>

        {/* Current & Best Streak */}
        <div
          className={`p-4 rounded-xl border ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Win Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold font-mono tabular-nums mt-2 text-amber-400">
            {stats.currentStreak}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Personal best: {stats.bestStreak}
          </div>
        </div>

        {/* Total Victories */}
        <div
          className={`p-4 rounded-xl border ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Victories</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold font-mono tabular-nums mt-2 text-emerald-400">
            {stats.winsP1}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Defeats: {stats.winsP2orAI}
          </div>
        </div>

        {/* Stalemate Draws */}
        <div
          className={`p-4 rounded-xl border ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Stalemates</span>
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold font-mono tabular-nums mt-2 text-slate-300">
            {stats.draws}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Draw rate: {drawRate}%
          </div>
        </div>
      </div>

      {/* Outcome Distribution Bar */}
      {total > 0 && (
        <div
          className={`p-4 rounded-xl border mb-6 ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Outcome Distribution</span>
            <span className="text-slate-400">
              {stats.winsP1}W · {stats.draws}D · {stats.winsP2orAI}L
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${winRate}%` }}
              className="bg-cyan-400 transition-all duration-500"
              title={`Wins: ${winRate}%`}
            />
            <div
              style={{ width: `${drawRate}%` }}
              className="bg-slate-500 transition-all duration-500"
              title={`Draws: ${drawRate}%`}
            />
            <div
              style={{ width: `${lossRate}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Losses: ${lossRate}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Victories ({winRate}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Draws ({drawRate}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Defeats ({lossRate}%)
            </span>
          </div>
        </div>
      )}

      {/* Match History Log */}
      <div>
        <h3 className="text-lg font-display font-semibold text-slate-100 mb-3">
          Recent Match Ledger
        </h3>

        {stats.history.length === 0 ? (
          <div
            className={`p-8 rounded-xl border text-center ${
              theme.isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <p className="text-sm text-slate-400">
              No matches recorded yet. Jump into the Arena and play your first game!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.history.slice(0, 15).map((match) => {
              const isWin = match.winner === 'X';
              const isLoss = match.winner === 'O';
              const isDraw = match.winner === 'draw';

              return (
                <div
                  key={match.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                    theme.isDark
                      ? 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0 ${
                        isWin
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : isLoss
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-700/20 text-slate-400 border border-slate-700/40'
                      }`}
                    >
                      {isWin ? 'W' : isLoss ? 'L' : 'D'}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-200">
                        {match.mode === 'vs-ai'
                          ? `Vs ${
                              match.aiDifficulty === 'master'
                                ? 'Unbeatable AI'
                                : match.aiDifficulty === 'medium'
                                ? 'Tactician AI'
                                : 'Rookie AI'
                            }`
                          : `${match.player1Name} vs ${match.player2Name}`}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{match.boardSize}×{match.boardSize} Grid</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.totalMoves} moves</span>
                        <span aria-hidden="true">·</span>
                        <span>{match.durationSeconds}s duration</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="text-xs text-slate-400 tabular-nums">
                      {new Date(match.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <button
                      onClick={() => setSelectedMatchForReview(match)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 transition-colors"
                      title="Inspect match replay"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Replay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Replay Modal if clicked */}
      {selectedMatchForReview && (
        <GameReviewModal
          isOpen={true}
          onClose={() => setSelectedMatchForReview(null)}
          size={selectedMatchForReview.boardSize}
          moves={selectedMatchForReview.moves}
          winner={selectedMatchForReview.winner}
          theme={theme}
          symbolPack={symbolPack}
        />
      )}
    </div>
  );
};
