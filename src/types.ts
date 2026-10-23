export type PlayerSymbol = 'X' | 'O';

export type GameMode = 'vs-ai' | 'pass-and-play';

export type AIDifficulty = 'easy' | 'medium' | 'master';

export type BoardSize = 3 | 4 | 5;

export type ThemeId = 'midnight' | 'emerald' | 'nordic' | 'cyberpunk';

export type SymbolPackId = 'classic' | 'elements' | 'celestial' | 'cyber';

export interface SymbolPack {
  id: SymbolPackId;
  name: string;
  xLabel: string;
  oLabel: string;
  xIcon: string; // display emoji / character
  oIcon: string;
  xColor: string;
  oColor: string;
}

export interface WinningLine {
  indices: number[];
  direction: 'row' | 'col' | 'diag-main' | 'diag-anti';
  rowOrColIndex?: number;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'draw';

export interface MoveRecord {
  player: PlayerSymbol;
  index: number;
  row: number;
  col: number;
  timestamp: number;
  boardSnapshot: (PlayerSymbol | null)[];
}

export interface MatchHistoryItem {
  id: string;
  date: string;
  mode: GameMode;
  aiDifficulty?: AIDifficulty;
  boardSize: BoardSize;
  winner: PlayerSymbol | 'draw';
  player1Name: string;
  player2Name: string;
  totalMoves: number;
  durationSeconds: number;
  moves: MoveRecord[];
  finalBoard: (PlayerSymbol | null)[];
  winningLine?: WinningLine | null;
}

export interface GameStats {
  matchesPlayed: number;
  winsP1: number;
  winsP2orAI: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  streakType: 'win' | 'loss' | 'none';
  history: MatchHistoryItem[];
}

export interface GameSettings {
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  boardSize: BoardSize;
  turnTimeLimit: number; // 0 for unlimited, or 5, 10, 15
  theme: ThemeId;
  symbolPack: SymbolPackId;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  player1Name: string;
  player2Name: string;
}
