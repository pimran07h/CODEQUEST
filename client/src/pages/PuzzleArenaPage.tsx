import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { 
  Puzzle, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Bug, 
  Cpu, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Trophy,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PuzzleArenaPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeGame, setActiveGame] = useState<'maze' | 'bughunter' | 'stack'>('maze');
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // ================= GAME 1: MAZE GRID RUNNER STATE =================
  const [gridSize] = useState(7);
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [robotDir, setRobotDir] = useState<'N' | 'E' | 'S' | 'W'>('E');
  const [gemsCollected, setGemsCollected] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [mazeWon, setMazeWon] = useState(false);

  // Maze layout (0: path, 1: wall, 2: gem, 3: exit)
  const initialMaze = [
    [0, 0, 1, 2, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 2, 0, 0],
    [0, 1, 1, 1, 1, 0, 1],
    [2, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 2, 0, 0, 3]
  ];
  const [mazeMap, setMazeMap] = useState<number[][]>(initialMaze);

  const resetMaze = () => {
    sound.playClick();
    setRobotPos({ x: 0, y: 0 });
    setRobotDir('E');
    setGemsCollected(0);
    setStepCount(0);
    setMazeWon(false);
    setMazeMap(initialMaze);
    setXpAwarded(null);
  };

  const moveRobot = (dx: number, dy: number, dir: 'N' | 'E' | 'S' | 'W') => {
    if (mazeWon) return;
    const nx = robotPos.x + dx;
    const ny = robotPos.y + dy;

    // Check bounds & walls
    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) {
      sound.playError();
      return;
    }
    if (mazeMap[ny][nx] === 1) {
      sound.playError();
      return;
    }

    sound.playClick();
    setRobotDir(dir);
    setRobotPos({ x: nx, y: ny });
    setStepCount(s => s + 1);

    // Gem pickup
    if (mazeMap[ny][nx] === 2) {
      sound.playSuccess();
      setGemsCollected(g => g + 1);
      const newMap = mazeMap.map((row, r) =>
        row.map((cell, c) => (r === ny && c === nx ? 0 : cell))
      );
      setMazeMap(newMap);
    }

    // Exit reached
    if (mazeMap[ny][nx] === 3) {
      sound.playLevelUp();
      setMazeWon(true);
      confetti({ particleCount: 70, spread: 60 });
      setXpAwarded(100);
    }
  };

  // ================= GAME 2: BUG HUNTER STATE =================
  const [bugScore, setBugScore] = useState(0);
  const [bugLives, setBugLives] = useState(3);
  const [bugGameOver, setBugGameOver] = useState(false);
  const [fallingCode, setFallingCode] = useState<Array<{ id: number; text: string; isBug: boolean; y: number }>>([]);

  const bugSnippets = [
    { text: 'int x = 10;', isBug: false },
    { text: 'if (x = 5) {', isBug: true }, // Assignment in conditional
    { text: 'while (true) {}', isBug: true }, // Infinite loop
    { text: 'return 0;', isBug: false },
    { text: 'for (int i=0; i<n; i++)', isBug: false },
    { text: 'print("Missing paren"', isBug: true },
    { text: 'const PI = 3.14;', isBug: false },
    { text: 'delete nullPointer;', isBug: true },
    { text: 'array[length + 1];', isBug: true } // Out of bounds
  ];

  const startBugHunter = () => {
    sound.playClick();
    setBugScore(0);
    setBugLives(3);
    setBugGameOver(false);
    setFallingCode([]);
    setXpAwarded(null);
  };

  useEffect(() => {
    if (activeGame !== 'bughunter' || bugGameOver) return;

    const spawnInterval = setInterval(() => {
      const template = bugSnippets[Math.floor(Math.random() * bugSnippets.length)];
      setFallingCode(prev => [
        ...prev,
        { id: Date.now() + Math.random(), text: template.text, isBug: template.isBug, y: 0 }
      ]);
    }, 2400);

    const fallInterval = setInterval(() => {
      setFallingCode(prev => {
        const next = [];
        for (const item of prev) {
          const ny = item.y + 12;
          if (ny >= 240) {
            // Hit bottom
            if (item.isBug) {
              // Missed a bug! Lose life
              setBugLives(l => {
                const nl = l - 1;
                if (nl <= 0) {
                  setBugGameOver(true);
                  sound.playError();
                }
                return nl;
              });
            }
          } else {
            next.push({ ...item, y: ny });
          }
        }
        return next;
      });
    }, 300);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(fallInterval);
    };
  }, [activeGame, bugGameOver]);

  const zapCode = (id: number, isBug: boolean) => {
    if (isBug) {
      sound.playSuccess();
      setBugScore(s => {
        const ns = s + 25;
        if (ns >= 150) {
          setBugGameOver(true);
          sound.playLevelUp();
          confetti({ particleCount: 60 });
          setXpAwarded(150);
        }
        return ns;
      });
    } else {
      // Zapped valid code! Penalty
      sound.playError();
      setBugLives(l => {
        const nl = l - 1;
        if (nl <= 0) setBugGameOver(true);
        return nl;
      });
    }
    setFallingCode(prev => prev.filter(c => c.id !== id));
  };

  // Keyboard controls for maze
  useEffect(() => {
    if (activeGame !== 'maze') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') moveRobot(0, -1, 'N');
      if (e.key === 'ArrowDown' || e.key === 's') moveRobot(0, 1, 'S');
      if (e.key === 'ArrowLeft' || e.key === 'a') moveRobot(-1, 0, 'W');
      if (e.key === 'ArrowRight' || e.key === 'd') moveRobot(1, 0, 'E');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, robotPos, mazeMap, mazeWon]);

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-600/40 text-purple-300 text-xs font-semibold mb-3">
          <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 2D Phaser & Canvas Arena</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-gaming text-white">
          Algorithmic Mini-Games
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Hone your core instincts through fast-paced logic mazes, syntax zap challenges, and call stack operations.
        </p>
      </div>

      {/* Game Mode Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { id: 'maze', label: '1. Robot Grid Runner (Maze)', icon: Cpu, badge: 'Loops & Path' },
          { id: 'bughunter', label: '2. Bug Zap: Syntax Hunter', icon: Bug, badge: 'Speed Debug' },
        ].map((g) => {
          const Icon = g.icon;
          const isSelected = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                sound.playClick();
                setActiveGame(g.id as any);
              }}
              className={`px-5 py-3 rounded-2xl border font-gaming text-xs font-semibold flex items-center gap-2.5 transition-all ${
                isSelected
                  ? 'bg-purple-950/80 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                  : 'bg-[#090d18] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{g.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-purple-300 border border-purple-800/40">
                {g.badge}
              </span>
            </button>
          );
        })}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="px-4 py-3 rounded-2xl border border-purple-800 bg-[#0c1224] text-purple-300 hover:text-white hover:border-cyan-400 font-gaming text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          title="Toggle Fullscreen Arena"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Arena'}</span>
        </button>
      </div>

      {/* Game Viewport Container */}
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#0c1222] border border-purple-900/50 shadow-2xl relative">
        
        {/* ================= MAZE GAME ================= */}
        {activeGame === 'maze' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-gaming text-white">Robot Grid Runner: While-Loop Maze</h3>
                <p className="text-xs text-slate-400">Guide the robot to the exit terminal [⚡] while gathering all mana crystals [💎].</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-cyan-300">Steps: <strong>{stepCount}</strong></span>
                <span className="text-yellow-400">Gems: <strong>{gemsCollected}/4</strong></span>
                <button
                  onClick={resetMaze}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            {/* 7x7 Grid */}
            <div className="flex justify-center">
              <div className="grid grid-cols-7 gap-1.5 p-4 rounded-2xl bg-[#070b14] border border-purple-900/40 shadow-inner">
                {mazeMap.map((row, r) =>
                  row.map((cell, c) => {
                    const isRobot = robotPos.x === c && robotPos.y === r;
                    const isWall = cell === 1;
                    const isGem = cell === 2;
                    const isExit = cell === 3;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg select-none transition-all ${
                          isRobot
                            ? 'bg-cyan-500 text-black shadow-neon-cyan scale-105 z-10'
                            : isWall
                            ? 'bg-slate-900 border border-slate-800'
                            : isGem
                            ? 'bg-purple-950/60 border border-purple-600/50'
                            : isExit
                            ? 'bg-emerald-950/70 border border-emerald-500/60'
                            : 'bg-[#0e1628] border border-slate-800/40'
                        }`}
                      >
                        {isRobot ? '🤖' : isWall ? '🧱' : isGem ? '💎' : isExit ? '⚡' : ''}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* On-screen Directional Buttons */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => moveRobot(0, -1, 'N')}
                className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold"
              >
                ▲ MOVE NORTH (W)
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => moveRobot(-1, 0, 'W')}
                  className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold"
                >
                  ◀ WEST (A)
                </button>
                <button
                  onClick={() => moveRobot(0, 1, 'S')}
                  className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold"
                >
                  ▼ SOUTH (S)
                </button>
                <button
                  onClick={() => moveRobot(1, 0, 'E')}
                  className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold"
                >
                  ▶ EAST (D)
                </button>
              </div>
            </div>

            {/* Victory Banner */}
            {mazeWon && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-center animate-bounce">
                <h4 className="text-lg font-bold font-gaming text-emerald-300">
                  🎉 Maze Conquered! Terminal Powered On!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Completed in {stepCount} steps with {gemsCollected} gems collected!
                </p>
                <div className="mt-2 text-sm font-mono text-cyan-300 font-bold">
                  +100 XP & +50 Coins Awarded!
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= BUG HUNTER GAME ================= */}
        {activeGame === 'bughunter' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-gaming text-white">Bug Zap: Syntax Sentry</h3>
                <p className="text-xs text-slate-400">Click to zap corrupted BUG statements! Let valid code reach the bottom.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-yellow-400">Score: <strong>{bugScore}/150</strong></span>
                <span className="text-rose-400">Shields: <strong>{'❤️'.repeat(bugLives)}</strong></span>
                <button
                  onClick={startBugHunter}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restart
                </button>
              </div>
            </div>

            {/* Arcade Falling Arena */}
            <div className="relative h-72 rounded-2xl bg-[#060a14] border border-purple-900/60 overflow-hidden flex flex-col justify-between p-4">
              
              {/* Falling Code Blocks */}
              <div className="relative w-full h-full">
                {fallingCode.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => zapCode(item.id, item.isBug)}
                    style={{ transform: `translateY(${item.y}px)` }}
                    className="absolute left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-purple-950/90 border border-purple-500 text-cyan-300 font-mono text-xs shadow-lg hover:border-rose-400 hover:bg-rose-950/80 hover:text-rose-200 transition-colors group cursor-crosshair"
                  >
                    <span>{item.text}</span>
                    <span className="ml-2 text-[10px] text-slate-400 group-hover:text-rose-300 font-bold">
                      [CLICK TO ZAP]
                    </span>
                  </button>
                ))}
              </div>

              {/* Firewall Base */}
              <div className="w-full py-2 bg-gradient-to-r from-purple-950 via-cyan-950 to-purple-950 border-t border-cyan-500/50 text-center text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                🛡️ Memory Protection Firewall Active
              </div>

              {/* Game Over / Victory Modal */}
              {bugGameOver && (
                <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
                  {bugScore >= 150 ? (
                    <>
                      <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
                      <h4 className="text-xl font-bold font-gaming text-emerald-400">Bug Sentry Victory!</h4>
                      <p className="text-xs text-slate-300 mt-1">You purged the memory leak before compilation failure.</p>
                      <p className="text-sm font-mono text-cyan-300 font-bold mt-2">+150 XP & +75 Coins Claimed!</p>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-12 h-12 text-rose-500 mb-2" />
                      <h4 className="text-xl font-bold font-gaming text-rose-400">Stack Corruption!</h4>
                      <p className="text-xs text-slate-400 mt-1">Bugs slipped past the firewall and drained your shields.</p>
                    </>
                  )}
                  <button
                    onClick={startBugHunter}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-semibold shadow-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
