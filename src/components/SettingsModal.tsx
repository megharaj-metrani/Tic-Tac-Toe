import React from 'react';
import { GameSettings, BoardSize, GameMode, AIDifficulty, ThemeId, SymbolPackId } from '../types';
import { THEMES, SYMBOL_PACKS, ThemeConfig } from '../utils/themeConfig';
import { X, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  currentTheme: ThemeConfig;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 border shadow-2xl ${
          currentTheme.isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 id="settings-title" className="text-xl font-display font-bold">
              Arena Configurations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize game mechanics, board size, AI difficulty, and aesthetics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Game Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Game Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'vs-ai' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  settings.mode === 'vs-ai'
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 ring-1 ring-cyan-500/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Player vs AI
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ mode: 'pass-and-play' })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  settings.mode === 'pass-and-play'
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 ring-1 ring-cyan-500/30'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Pass & Play (2P)
              </button>
            </div>
          </div>

          {/* AI Difficulty (only visible if mode is vs-ai) */}
          {settings.mode === 'vs-ai' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                AI Difficulty Engine
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Rookie', sub: 'Casual' },
                  { id: 'medium', label: 'Tactician', sub: 'Balanced' },
                  { id: 'master', label: 'Master', sub: 'Unbeatable' },
                ].map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => onUpdateSettings({ aiDifficulty: diff.id as AIDifficulty })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      settings.aiDifficulty === diff.id
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 ring-1 ring-cyan-500/30'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-semibold">{diff.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{diff.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Board Size */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Board Dimensions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { size: 3, label: '3×3 Classic', desc: '3 in a row' },
                { size: 4, label: '4×4 Expanded', desc: '4 in a row' },
                { size: 5, label: '5×5 Arena', desc: '4 in a row' },
              ].map((item) => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => onUpdateSettings({ boardSize: item.size as BoardSize })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings.boardSize === item.size
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer / Blitz Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Turn Speed Timer (Blitz)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 0, label: 'Off', desc: 'Relaxed' },
                { val: 5, label: '5s', desc: 'Fast Blitz' },
                { val: 10, label: '10s', desc: 'Standard' },
                { val: 15, label: '15s', desc: 'Strategic' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => onUpdateSettings({ turnTimeLimit: item.val })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    settings.turnTimeLimit === item.val
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Visual Arena Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((themeItem) => (
                <button
                  key={themeItem.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: themeItem.id as ThemeId })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.theme === themeItem.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {themeItem.name}
                    </span>
                    <div className="flex gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: themeItem.accentP1.color }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: themeItem.accentP2.color }}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {themeItem.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Symbol Pack */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Symbol Insignia Pack
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(SYMBOL_PACKS).map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => onUpdateSettings({ symbolPack: pack.id as SymbolPackId })}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    settings.symbolPack === pack.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/30'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{pack.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {pack.xLabel} vs {pack.oLabel}
                    </div>
                  </div>
                  <div className="text-lg font-display flex items-center gap-1">
                    <span>{pack.xIcon}</span>
                    <span>{pack.oIcon}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Haptic Toggles */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              {settings.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>Audio Effects: Enabled</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400">Audio Effects: Muted</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
              className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Smartphone className={`w-4 h-4 ${settings.hapticsEnabled ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>Haptics: {settings.hapticsEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-cyan-400/20"
          >
            Apply & Return to Game
          </button>
        </div>
      </div>
    </div>
  );
};
