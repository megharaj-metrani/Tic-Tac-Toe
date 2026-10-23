import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BoardSize,
  GameMode,
  PlayerSymbol,
  WinningLine,
  MoveRecord,
  MatchHistoryItem,
  GameStats,
  GameSettings,
  GameStatus,
} from './types';
import { checkWinner, isBoardFull, getAIMove, getTacticalHint } from './utils/gameLogic';
import { soundManager, triggerHaptic } from './utils/sound';
import { THEMES, SYMBOL_PACKS, ThemeConfig } from './utils/themeConfig';
import { GameBoard } from './components/GameBoard';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { GameReviewModal } from './components/GameReviewModal';
import { StatsView } from './components/StatsView';
import { SettingsModal } from './components/SettingsModal';
import { StrategyGuide } from './components/StrategyGuide';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import {
  RotateCcw,
  Sparkles,
  Undo2,
  Sliders,
  Volume2,
  VolumeX,
  Swords,
  Eye,
  Info,
} from 'lucide-react';

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'vs-ai',
  aiDifficulty: 'master',
  boardSize: 3,
  turnTimeLimit: 0, // unlimited by default
  theme: 'midnight',
  symbolPack: 'classic',
  soundEnabled: true,
  hapticsEnabled: true,
  player1Name: 'Player 1',
  player2Name: 'Player 2',
};

const DEFAULT_STATS: GameStats = {
  matchesPlayed: 0,
  winsP1: 0,
  winsP2orAI: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  streakType: 'none',
  history: [],
};

export default function App() {
  // Navigation tabs: 'arena' | 'stats' | 'guide'
  const [activeTab, setActiveTab] = useState<'arena' | 'stats' | 'guide'>('arena');

  // Stored Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const stored = localStorage.getItem('ttt_arena_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Stored Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const stored = localStorage.getItem('ttt_arena_stats');
      return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Active Game State
  const [board, setBoard] = useState<(PlayerSymbol | null)[]>(() =>
    Array(settings.boardSize * settings.boardSize).fill(null)
  );
  const [currentTurn, setCurrentTurn] = useState<PlayerSymbol>('X');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [winner, setWinner] = useState<PlayerSymbol | 'draw' | null>(null);
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [matchStartTime, setMatchStartTime] = useState<number>(Date.now());
  const [matchDuration, setMatchDuration] = useState<number>(0);

  // Blitz Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(
    settings.turnTimeLimit > 0 ? settings.turnTimeLimit : null
  );

  // Tactical Hint
  const [hint, setHint] = useState<{ move: number; rationale: string } | null>(null);

  // UI Modals
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Resolved Theme and Symbol Pack
  const currentTheme: ThemeConfig = THEMES[settings.theme] || THEMES.midnight;
  const currentSymbolPack = SYMBOL_PACKS[settings.symbolPack] || SYMBOL_PACKS.classic;

  // Sound sync
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Save settings on update
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ttt_arena_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // If board size changed, reset the board
    if (newSettings.boardSize && newSettings.boardSize !== settings.boardSize) {
      resetGame(newSettings.boardSize);
    }
  };

  // Clear statistics handler
  const handleClearStats = () => {
    setStats(DEFAULT_STATS);
    try {
      localStorage.removeItem('ttt_arena_stats');
    } catch {}
  };

  // Reset Game
  const resetGame = useCallback(
    (boardSize = settings.boardSize) => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
      setBoard(Array(boardSize * boardSize).fill(null));
      setCurrentTurn('X');
      setStatus('idle');
      setWinningLine(null);
      setWinner(null);
      setMoves([]);
      setIsAiThinking(false);
      setHint(null);
      setIsGameOverModalOpen(false);
      setIsReviewOpen(false);
      setShowConfetti(false);
      setMatchStartTime(Date.now());
      setMatchDuration(0);
      setTimeLeft(settings.turnTimeLimit > 0 ? settings.turnTimeLimit : null);
    },
    [settings.boardSize, settings.turnTimeLimit]
  );

  // Record completed match into stats
  const recordMatchOutcome = useCallback(
    (matchWinner: PlayerSymbol | 'draw', finalBoard: (PlayerSymbol | null)[], line: WinningLine | null) => {
      const duration = Math.max(1, Math.round((Date.now() - matchStartTime) / 1000));
      setMatchDuration(duration);

      const historyItem: MatchHistoryItem = {
        id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: new Date().toISOString(),
        mode: settings.mode,
        aiDifficulty: settings.mode === 'vs-ai' ? settings.aiDifficulty : undefined,
        boardSize: settings.boardSize,
        winner: matchWinner,
        player1Name: settings.player1Name,
        player2Name: settings.player2Name,
        totalMoves: moves.length + 1,
        durationSeconds: duration,
        moves: [...moves],
        finalBoard: [...finalBoard],
        winningLine: line,
      };

      setStats((prev) => {
        let winsP1 = prev.winsP1;
        let winsP2orAI = prev.winsP2orAI;
        let draws = prev.draws;
        let currentStreak = prev.currentStreak;
        let bestStreak = prev.bestStreak;
        let streakType = prev.streakType;

        if (matchWinner === 'X') {
          winsP1 += 1;
          if (streakType === 'win') {
            currentStreak += 1;
          } else {
            streakType = 'win';
            currentStreak = 1;
          }
          if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
          }
        } else if (matchWinner === 'O') {
          winsP2orAI += 1;
          if (streakType === 'loss') {
            currentStreak += 1;
          } else {
            streakType = 'loss';
            currentStreak = 1;
          }
        } else {
          draws += 1;
        }

        const updated: GameStats = {
          matchesPlayed: prev.matchesPlayed + 1,
          winsP1,
          winsP2orAI,
          draws,
          currentStreak,
          bestStreak,
          streakType,
          history: [historyItem, ...prev.history].slice(0, 50),
        };

        try {
          localStorage.setItem('ttt_arena_stats', JSON.stringify(updated));
        } catch {}

        return updated;
      });
    },
    [matchStartTime, settings, moves]
  );

  // Turn Timeout (Blitz Mode)
  const handleTurnTimeout = useCallback(() => {
    if (status !== 'playing' && status !== 'idle') return;

    soundManager.playLose();
    // Current player forfeited due to time
    const otherPlayer: PlayerSymbol = currentTurn === 'X' ? 'O' : 'X';
    setWinner(otherPlayer);
    setStatus(currentTurn === 'X' && settings.mode === 'vs-ai' ? 'lost' : 'won');
    recordMatchOutcome(otherPlayer, board, null);
    setIsGameOverModalOpen(true);
  }, [status, currentTurn, settings.mode, recordMatchOutcome, board]);

  // Blitz Timer countdown effect
  useEffect(() => {
    if (settings.turnTimeLimit <= 0 || (status !== 'playing' && moves.length === 0)) return;
    if (winner !== null || isAiThinking) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return settings.turnTimeLimit;
        if (prev <= 1) {
          clearInterval(timer);
          handleTurnTimeout();
          return 0;
        }
        if (prev <= 4) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.turnTimeLimit, status, currentTurn, winner, isAiThinking, moves.length, handleTurnTimeout]);

  // Handle human move placement
  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null || isAiThinking) return;

    // First move starts timer
    if (status === 'idle') {
      setStatus('playing');
      setMatchStartTime(Date.now());
    }

    // Clear active hint on move
    setHint(null);

    // Audio & Haptic feedback
    soundManager.playMove(currentTurn);
    triggerHaptic(settings.hapticsEnabled, 35);

    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);

    // Record move
    const newMove: MoveRecord = {
      player: currentTurn,
      index,
      row: Math.floor(index / settings.boardSize),
      col: index % settings.boardSize,
      timestamp: Date.now(),
      boardSnapshot: [...newBoard],
    };
    const updatedMoves = [...moves, newMove];
    setMoves(updatedMoves);

    // Check for win or draw
    const { winner: matchWinner, winningLine: line } = checkWinner(newBoard, settings.boardSize);

    if (matchWinner) {
      setWinner(matchWinner);
      setWinningLine(line);
      const isP1 = matchWinner === 'X';
      setStatus(isP1 ? 'won' : settings.mode === 'vs-ai' ? 'lost' : 'won');

      if (isP1 || settings.mode === 'pass-and-play') {
        soundManager.playWin();
        setShowConfetti(true);
      } else {
        soundManager.playLose();
      }

      recordMatchOutcome(matchWinner, newBoard, line);
      setIsGameOverModalOpen(true);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      setStatus('draw');
      soundManager.playDraw();
      recordMatchOutcome('draw', newBoard, null);
      setIsGameOverModalOpen(true);
      return;
    }

    // Switch turn
    if (settings.mode === 'vs-ai') {
      setCurrentTurn('O');
      executeAiTurn(newBoard, updatedMoves);
    } else {
      const nextTurn: PlayerSymbol = currentTurn === 'X' ? 'O' : 'X';
      setCurrentTurn(nextTurn);
      setTimeLeft(settings.turnTimeLimit > 0 ? settings.turnTimeLimit : null);
    }
  };

  // Dedicated AI Move Timer Ref
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean, rapid AI Turn Execution (180ms delay, zero freeze)
  const executeAiTurn = useCallback(
    (currentBoard: (PlayerSymbol | null)[], currentMoves: MoveRecord[]) => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
      }
      setIsAiThinking(true);

      aiTimerRef.current = setTimeout(() => {
        const aiIndex = getAIMove(currentBoard, settings.boardSize, settings.aiDifficulty, 'O');

        if (aiIndex >= 0 && currentBoard[aiIndex] === null) {
          soundManager.playMove('O');
          triggerHaptic(settings.hapticsEnabled, 25);

          const newBoard = [...currentBoard];
          newBoard[aiIndex] = 'O';
          setBoard(newBoard);

          const newMove: MoveRecord = {
            player: 'O',
            index: aiIndex,
            row: Math.floor(aiIndex / settings.boardSize),
            col: aiIndex % settings.boardSize,
            timestamp: Date.now(),
            boardSnapshot: [...newBoard],
          };
          const nextMoves = [...currentMoves, newMove];
          setMoves(nextMoves);

          const { winner: matchWinner, winningLine: line } = checkWinner(newBoard, settings.boardSize);

          if (matchWinner) {
            setWinner(matchWinner);
            setWinningLine(line);
            setStatus('lost');
            soundManager.playLose();
            recordMatchOutcome(matchWinner, newBoard, line);
            setIsGameOverModalOpen(true);
          } else if (isBoardFull(newBoard)) {
            setWinner('draw');
            setStatus('draw');
            soundManager.playDraw();
            recordMatchOutcome('draw', newBoard, null);
            setIsGameOverModalOpen(true);
          } else {
            setCurrentTurn('X');
            setTimeLeft(settings.turnTimeLimit > 0 ? settings.turnTimeLimit : null);
          }
        }

        setIsAiThinking(false);
        aiTimerRef.current = null;
      }, 180);
    },
    [settings.boardSize, settings.aiDifficulty, settings.hapticsEnabled, settings.turnTimeLimit, recordMatchOutcome]
  );

  // Cleanup pending AI timers on unmount
  useEffect(() => {
    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
      }
    };
  }, []);

  // Request Tactical Hint
  const handleRequestHint = () => {
    if (winner !== null || isAiThinking) return;
    const tactical = getTacticalHint(board, settings.boardSize, currentTurn);
    if (tactical) {
      setHint(tactical);
      soundManager.playHint();
      triggerHaptic(settings.hapticsEnabled, 20);
    }
  };

  // Undo Move
  const handleUndoMove = () => {
    if (moves.length === 0 || winner !== null || isAiThinking) return;

    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsAiThinking(false);

    // In vs-AI mode, undoing one human move should also undo the AI's response if it happened
    const stepsToUndo = settings.mode === 'vs-ai' && moves.length >= 2 ? 2 : 1;
    const remainingMoves = moves.slice(0, moves.length - stepsToUndo);

    const reconstructed = Array(settings.boardSize * settings.boardSize).fill(null);
    for (const m of remainingMoves) {
      reconstructed[m.index] = m.player;
    }

    setBoard(reconstructed);
    setMoves(remainingMoves);
    setWinningLine(null);
    setWinner(null);
    setHint(null);
    setStatus(remainingMoves.length > 0 ? 'playing' : 'idle');

    if (remainingMoves.length === 0) {
      setCurrentTurn('X');
    } else {
      const lastPlayer = remainingMoves[remainingMoves.length - 1].player;
      setCurrentTurn(lastPlayer === 'X' ? 'O' : 'X');
    }
    setTimeLeft(settings.turnTimeLimit > 0 ? settings.turnTimeLimit : null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${currentTheme.bgClass} ${currentTheme.textPrimary}`}
    >
      {/* Confetti Celebration */}
      <ConfettiCanvas active={showConfetti} />

      {/* TOP BAR CONTRACT: Zone 1 (Wordmark) - Zone 2 (3-4 Nav Links) - Zone 3 (1 Action CTA) */}
      <header
        className={`w-full flex items-center justify-between gap-8 px-5 sm:px-8 py-3.5 border-b shrink-0 ${
          currentTheme.isDark
            ? 'bg-slate-950/90 border-slate-800/80 backdrop-blur-md'
            : 'bg-white/95 border-slate-200 backdrop-blur-md'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveTab('arena');
          }}
          className="text-lg font-display font-extrabold tracking-tight text-slate-100 flex items-center gap-2 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <Swords className="w-5 h-5 text-cyan-400" />
          <span>Tic Tac Toe Arena</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('arena')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'arena'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Play Arena
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'stats'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Analytics & Ledger
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'guide'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Strategy Guide
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
            }
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title={settings.soundEnabled ? 'Mute sound' : 'Enable sound'}
            aria-label={settings.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            title="Arena Settings"
            aria-label="Arena Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => resetGame()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-sm shadow-cyan-400/20 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Match
          </button>
        </div>
      </header>

      {/* Mobile Sub-Navigation Tabs */}
      <div className="flex md:hidden items-center justify-around border-b border-slate-800/60 bg-slate-950/60 text-xs py-2 px-2 shrink-0">
        <button
          onClick={() => setActiveTab('arena')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'arena'
              ? 'text-cyan-400 font-semibold bg-slate-900'
              : 'text-slate-400'
          }`}
        >
          Play Arena
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'stats'
              ? 'text-cyan-400 font-semibold bg-slate-900'
              : 'text-slate-400'
          }`}
        >
          Analytics ({stats.matchesPlayed})
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1 rounded-md ${
            activeTab === 'guide'
              ? 'text-cyan-400 font-semibold bg-slate-900'
              : 'text-slate-400'
          }`}
        >
          Tactics Guide
        </button>
      </div>

      {/* Main App Body */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-6">
        {activeTab === 'arena' && (
          <div className="w-full flex flex-col items-center justify-center">
            {/* Top HUD */}
            <GameHUD
              player1Name={settings.player1Name}
              player2Name={settings.player2Name}
              p1Score={stats.winsP1}
              p2Score={stats.winsP2orAI}
              draws={stats.draws}
              currentTurn={currentTurn}
              mode={settings.mode}
              aiDifficulty={settings.aiDifficulty}
              isAiThinking={isAiThinking}
              timeLeft={timeLeft}
              totalTurnTime={settings.turnTimeLimit}
              theme={currentTheme}
              symbolPack={currentSymbolPack}
            />

            {/* Tactical Hint Banner if active */}
            {hint && (
              <div className="w-full max-w-md mx-auto mt-3 px-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block font-semibold">
                      Tactical Advisory
                    </strong>
                    {hint.rationale}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Game Board */}
            <GameBoard
              board={board}
              size={settings.boardSize}
              onCellClick={handleCellClick}
              winningLine={winningLine}
              currentTurn={currentTurn}
              disabled={winner !== null || isAiThinking}
              theme={currentTheme}
              symbolPack={currentSymbolPack}
              hintCell={hint ? hint.move : null}
              lastMoveIndex={moves.length > 0 ? moves[moves.length - 1].index : null}
            />

            {/* Bottom In-Game Tactical Action Bar */}
            <div className="flex items-center justify-center gap-2 mt-2 px-4">
              <button
                onClick={handleRequestHint}
                disabled={winner !== null || isAiThinking}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed border border-amber-500/20 transition-colors whitespace-nowrap"
                title="Get strategic move hint"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Hint
              </button>

              <button
                onClick={handleUndoMove}
                disabled={moves.length === 0 || winner !== null || isAiThinking}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/60 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700/60 transition-colors whitespace-nowrap"
                title="Take back last move"
              >
                <Undo2 className="w-3.5 h-3.5" />
                Undo
              </button>

              {moves.length > 0 && (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors whitespace-nowrap"
                  title="Step through moves replay"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Review ({moves.length})
                </button>
              )}

              <button
                onClick={() => resetGame()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition-colors whitespace-nowrap"
                title="Restart board"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart
              </button>
            </div>

            {/* Quick Status Kicker */}
            <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <span>{settings.boardSize}×{settings.boardSize} Grid</span>
              <span aria-hidden="true">·</span>
              <span>
                {settings.boardSize === 5 ? '4-in-a-row to win' : `${settings.boardSize}-in-a-row to win`}
              </span>
              <span aria-hidden="true">·</span>
              <span>Numpad 1–9 or Click to Play</span>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <StatsView
            stats={stats}
            theme={currentTheme}
            symbolPack={currentSymbolPack}
            onClearStats={handleClearStats}
          />
        )}

        {activeTab === 'guide' && (
          <StrategyGuide
            theme={currentTheme}
            onBackToGame={() => setActiveTab('arena')}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer
        className={`w-full py-3 px-6 text-center text-xs text-slate-400 border-t ${
          currentTheme.isDark ? 'border-slate-800/60' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <span>Tic Tac Toe Arena</span>
          <span aria-hidden="true">·</span>
          <span>Unbeatable Minimax AI</span>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setActiveTab('guide')}
            className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            Rules & Strategy
          </button>
        </div>
      </footer>

      {/* Game Over Celebration / Defeat Modal */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        winner={winner}
        mode={settings.mode}
        aiDifficulty={settings.aiDifficulty}
        player1Name={settings.player1Name}
        player2Name={settings.player2Name}
        movesCount={moves.length}
        durationSeconds={matchDuration}
        streak={stats.currentStreak}
        theme={currentTheme}
        symbolPack={currentSymbolPack}
        onRematch={() => {
          resetGame();
        }}
        onReview={() => {
          setIsGameOverModalOpen(false);
          setIsReviewOpen(true);
        }}
        onClose={() => setIsGameOverModalOpen(false)}
      />

      {/* Move Review Modal */}
      <GameReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        size={settings.boardSize}
        moves={moves}
        winner={winner}
        theme={currentTheme}
        symbolPack={currentSymbolPack}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentTheme={currentTheme}
      />
    </div>
  );
}
