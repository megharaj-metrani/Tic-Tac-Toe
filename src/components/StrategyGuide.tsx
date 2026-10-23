import React from 'react';
import { ThemeConfig } from '../utils/themeConfig';
import { Target, Shield, Compass, Zap, BookOpen } from 'lucide-react';

interface StrategyGuideProps {
  theme: ThemeConfig;
  onBackToGame: () => void;
}

export const StrategyGuide: React.FC<StrategyGuideProps> = ({ theme, onBackToGame }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Grandmaster Strategy Manual
          </h2>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Positional theory</span>
            <span aria-hidden="true">·</span>
            <span>Unbeatable defense</span>
            <span aria-hidden="true">·</span>
            <span>Forking techniques</span>
          </div>
        </div>

        <button
          onClick={onBackToGame}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-400/20"
        >
          Return to Play Arena
        </button>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Strategy 1: The Fork Tactic */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-cyan-400 mb-2.5">
            <Zap className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-slate-100">
              01. The Dual Threat Fork
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            A fork occurs when you place a mark that establishes two unblocked winning lines simultaneously. Because your opponent can only block one line on their turn, victory on the subsequent turn is guaranteed.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Execution:</strong> Open with an initial corner. If the opponent fails to claim the center, capture the opposite corner to set up an inescapable double threat.
          </div>
        </div>

        {/* Strategy 2: Absolute Center Control */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-amber-400 mb-2.5">
            <Target className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-slate-100">
              02. Center Square Geometry
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            The center cell is the most strategically potent square on the board because it belongs to 4 distinct winning vectors (1 horizontal, 1 vertical, and 2 diagonals), whereas corner squares only intersect 3 lines and edges only 2.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Execution:</strong> If playing second and the opponent opens in a corner, always occupy the center immediately to deny them the immediate diagonal trap.
          </div>
        </div>

        {/* Strategy 3: Countering Edge Gambits */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-rose-400 mb-2.5">
            <Shield className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-slate-100">
              03. Impenetrable Defense
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            In perfect play, Tic Tac Toe between two skilled players is mathematically proven to end in a draw. To avoid defeat against the Master AI, never place your mark on a non-defensive edge if both adjacent corners are vacant.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Golden Rule:</strong> Match corner with corner, respond to center with corner, and verify opponent 2-in-a-row connections before committing to an offensive move.
          </div>
        </div>

        {/* Strategy 4: 4x4 and 5x5 Expansion Tactics */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme.isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 text-emerald-400 mb-2.5">
            <Compass className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-slate-100">
              04. Expanded Grid Dynamics (4×4 & 5×5)
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            On 4×4 and 5×5 boards (where 4-in-a-row wins), open-ended 3-streaks (with both ends vacant) are lethal. Once a player achieves an unblocked 3-sequence, the opponent can only block one side, allowing an instant win on the other.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Execution:</strong> Prioritize building consecutive connected runs toward the center rather than isolated corner placements.
          </div>
        </div>
      </div>
    </div>
  );
};
