import { SymbolPack, SymbolPackId, ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  bgClass: string;
  cardBgClass: string;
  surfaceMuted: string;
  borderClass: string;
  textPrimary: string;
  textSecondary: string;
  accentP1: {
    color: string;
    text: string;
    bg: string;
    border: string;
    glow: string;
  };
  accentP2: {
    color: string;
    text: string;
    bg: string;
    border: string;
    glow: string;
  };
  accentNeutral: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Slate',
    description: 'Deep obsidian dark canvas with electric cyan & rose neon accents',
    isDark: true,
    bgClass: 'bg-slate-950',
    cardBgClass: 'bg-slate-900/90',
    surfaceMuted: 'bg-slate-800/60',
    borderClass: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accentP1: {
      color: '#06b6d4',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]',
    },
    accentP2: {
      color: '#f43f5e',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.35)]',
    },
    accentNeutral: 'text-cyan-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Arcade Emerald',
    description: 'Vintage CRT arcade felt with radiant emerald & amber gold',
    isDark: true,
    bgClass: 'bg-zinc-950',
    cardBgClass: 'bg-emerald-950/30',
    surfaceMuted: 'bg-emerald-900/20',
    borderClass: 'border-emerald-800/40',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-400/70',
    accentP1: {
      color: '#10b981',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    },
    accentP2: {
      color: '#f59e0b',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    },
    accentNeutral: 'text-emerald-400',
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Frost',
    description: 'Crisp editorial porcelain aesthetic with refined indigo & coral',
    isDark: false,
    bgClass: 'bg-slate-100',
    cardBgClass: 'bg-white',
    surfaceMuted: 'bg-slate-200/70',
    borderClass: 'border-slate-300',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    accentP1: {
      color: '#4f46e5',
      text: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      glow: 'shadow-[0_0_15px_rgba(79,70,229,0.2)]',
    },
    accentP2: {
      color: '#e11d48',
      text: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      glow: 'shadow-[0_0_15px_rgba(225,29,72,0.2)]',
    },
    accentNeutral: 'text-indigo-600',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Horizon',
    description: 'High-tech neo-tokyo violet with electric fuchsia and solar yellow',
    isDark: true,
    bgClass: 'bg-neutral-950',
    cardBgClass: 'bg-purple-950/30',
    surfaceMuted: 'bg-purple-900/20',
    borderClass: 'border-purple-800/40',
    textPrimary: 'text-neutral-100',
    textSecondary: 'text-purple-300/70',
    accentP1: {
      color: '#e879f9',
      text: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
      border: 'border-fuchsia-500/30',
      glow: 'shadow-[0_0_20px_rgba(232,121,249,0.35)]',
    },
    accentP2: {
      color: '#facc15',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      glow: 'shadow-[0_0_20px_rgba(250,204,21,0.35)]',
    },
    accentNeutral: 'text-fuchsia-400',
  },
};

export const SYMBOL_PACKS: Record<SymbolPackId, SymbolPack> = {
  classic: {
    id: 'classic',
    name: 'Classic X & O',
    xLabel: 'Cross (X)',
    oLabel: 'Nought (O)',
    xIcon: '✕',
    oIcon: '○',
    xColor: '#06b6d4',
    oColor: '#f43f5e',
  },
  elements: {
    id: 'elements',
    name: 'Elemental Fire & Water',
    xLabel: 'Fire (Pyro)',
    oLabel: 'Water (Aqua)',
    xIcon: '🔥',
    oIcon: '💧',
    xColor: '#f97316',
    oColor: '#38bdf8',
  },
  celestial: {
    id: 'celestial',
    name: 'Celestial Solar & Lunar',
    xLabel: 'Solar Star',
    oLabel: 'Lunar Crescent',
    xIcon: '☀️',
    oIcon: '🌙',
    xColor: '#facc15',
    oColor: '#a78bfa',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Strike & Aegis',
    xLabel: 'Volt Blade',
    oLabel: 'Aegis Shield',
    xIcon: '⚡',
    oIcon: '🛡️',
    xColor: '#22d3ee',
    oColor: '#10b981',
  },
};
