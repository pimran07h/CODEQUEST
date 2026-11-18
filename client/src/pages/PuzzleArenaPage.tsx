import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
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
  Minimize2,
  ChevronRight,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ==========================================
// MAZE LEVEL CONFIGURATIONS
// ==========================================
interface MazeLevel {
  id: number;
  name: string;
  topic: string;
  size: number;
  startX: number;
  startY: number;
  totalGems: number;
  xpReward: number;
  map: number[][]; // 0: path, 1: wall, 2: gem, 3: exit
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    name: "Level 1: While-Loop Corridor",
    topic: "Variables & Simple Loops",
    size: 7,
    startX: 0,
    startY: 0,
    totalGems: 4,
    xpReward: 100,
    map: [
      [0, 0, 1, 2, 0, 0, 0],
      [1, 0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 2, 0, 0],
      [0, 1, 1, 1, 1, 0, 1],
      [2, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 2, 0, 0, 3]
    ]
  },
  {
    id: 2,
    name: "Level 2: Nested-Loop Cavern",
    topic: "Conditionals & Logic Gates",
    size: 8,
    startX: 0,
    startY: 0,
    totalGems: 5,
    xpReward: 150,
    map: [
      [0, 0, 0, 1, 2, 0, 0, 0],
      [1, 1, 0, 1, 0, 1, 1, 0],
      [2, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 1, 2],
      [1, 0, 1, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 2, 0, 0, 0, 0, 3]
    ]
  },
  {
    id: 3,
    name: "Level 3: Recursion Labyrinth",
    topic: "Depth-First Search & Stack Trace",
    size: 9,
    startX: 0,
    startY: 0,
    totalGems: 6,
    xpReward: 200,
    map: [
      [0, 0, 1, 2, 0, 0, 1, 0, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 1, 2],
      [2, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 2, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 0, 1, 2],
      [0, 2, 0, 0, 0, 0, 0, 0, 3]
    ]
  }
];

// ==========================================
// BUG HUNTER WAVE CONFIGURATIONS
// ==========================================
interface BugWave {
  wave: number;
  title: string;
  targetScore: number;
  speed: number;
  spawnRate: number;
  snippets: Array<{ text: string; isBug: boolean; errorNote: string }>;
}

const BUG_WAVES: BugWave[] = [
  {
    wave: 1,
    title: "Wave 1: Syntax & Operators",
    targetScore: 100,
    speed: 10,
    spawnRate: 2000,
    snippets: [
      { text: 'int x = 10;', isBug: false, errorNote: 'Valid C declaration' },
      { text: 'if (x = 5) {', isBug: true, errorNote: 'Assignment in condition (= instead of ==)' },
      { text: 'print("Hello World"', isBug: true, errorNote: 'Missing closing parenthesis' },
      { text: 'return 0;', isBug: false, errorNote: 'Valid return statement' },
      { text: 'for (int i=0; i<5; i++)', isBug: false, errorNote: 'Valid for loop' },
      { text: 'int num = "text";', isBug: true, errorNote: 'Type mismatch string to int' }
    ]
  },
  {
    wave: 2,
    title: "Wave 2: Loop Logic & Infinite Traps",
    targetScore: 150,
    speed: 14,
    spawnRate: 1700,
    snippets: [
      { text: 'while (true) {}', isBug: true, errorNote: 'Infinite loop with no break' },
      { text: 'for (int i=0; i<10; i--)', isBug: true, errorNote: 'Infinite decrement loop' },
      { text: 'const PI = 3.14159;', isBug: false, errorNote: 'Valid constant declaration' },
      { text: 'arr[length];', isBug: true, errorNote: 'Index out of bounds (0 to length-1)' },
      { text: 'def add(a, b): return a+b', isBug: false, errorNote: 'Valid Python function' },
      { text: 'int* ptr = NULL; *ptr = 5;', isBug: true, errorNote: 'Null pointer dereference' }
    ]
  },
  {
    wave: 3,
    title: "Wave 3: Memory & Advanced Algorithms",
    targetScore: 200,
    speed: 18,
    spawnRate: 1400,
    snippets: [
      { text: 'delete ptr; delete ptr;', isBug: true, errorNote: 'Double free memory crash' },
      { text: 'int mid = low + (high-low)/2;', isBug: false, errorNote: 'Safe binary search midpoint' },
      { text: 'free(allocated_mem);', isBug: false, errorNote: 'Valid memory cleanup' },
      { text: 'char str[3] = "TEST";', isBug: true, errorNote: 'Buffer overflow (needs 5 chars)' },
      { text: 'stack.pop(); // empty check done', isBug: false, errorNote: 'Safe stack pop' },
      { text: 'int recurse() { return recurse(); }', isBug: true, errorNote: 'Stack overflow recursion' }
    ]
  }
];

export const PuzzleArenaPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeGame, setActiveGame] = useState<'maze' | 'bughunter' | 'stack'>('maze');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ==========================================
  // GAME 1: MAZE GRID RUNNER STATE & LEVELS
  // ==========================================
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = MAZE_LEVELS[currentLevelIdx];

  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [robotDir, setRobotDir] = useState<'N' | 'E' | 'S' | 'W'>('E');
  const [gemsCollected, setGemsCollected] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [mazeWon, setMazeWon] = useState(false);
  const [mazeMap, setMazeMap] = useState<number[][]>(currentLevel.map);

  // Load level helper
  const loadMazeLevel = (lvlIdx: number) => {
    sound.playClick();
    const lvl = MAZE_LEVELS[lvlIdx];
    setCurrentLevelIdx(lvlIdx);
    setRobotPos({ x: lvl.startX, y: lvl.startY });
    setRobotDir('E');
    setGemsCollected(0);
    setStepCount(0);
    setMazeWon(false);
    // Deep clone the map so modifications don't mutate template
    setMazeMap(lvl.map.map(row => [...row]));
  };

  const resetCurrentLevel = () => {
    loadMazeLevel(currentLevelIdx);
  };

  const handleNextLevel = () => {
    sound.playSuccess();
    const nextIdx = (currentLevelIdx + 1) % MAZE_LEVELS.length;
    loadMazeLevel(nextIdx);
  };

  // Robot locomotion
  const moveRobot = (dx: number, dy: number, dir: 'N' | 'E' | 'S' | 'W') => {
    if (mazeWon) return;
    const nx = robotPos.x + dx;
    const ny = robotPos.y + dy;

    // Bounds check
    if (nx < 0 || nx >= currentLevel.size || ny < 0 || ny >= currentLevel.size) {
      sound.playError();
      return;
    }
    // Wall check
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
      sound.playCrystalCollect();
      setGemsCollected(g => g + 1);
      const newMap = mazeMap.map((row, r) =>
        row.map((cell, c) => (r === ny && c === nx ? 0 : cell))
      );
      setMazeMap(newMap);
    }

    // Exit check
    if (mazeMap[ny][nx] === 3) {
      sound.playLevelUp();
      setMazeWon(true);
      confetti({ particleCount: 90, spread: 80 });

      // Award XP to profile
      try {
        api.submitCode(`maze-lvl-${currentLevel.id}`, `level_${currentLevel.id}`, 'javascript', user?.id || 'demo');
        refreshUser();
      } catch {}
    }
  };

  // Keyboard controls for maze (prevent scroll bug)
  useEffect(() => {
    if (activeGame !== 'maze') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault(); // Stop window scrolling bug
      }
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') moveRobot(0, -1, 'N');
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') moveRobot(0, 1, 'S');
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveRobot(-1, 0, 'W');
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRobot(1, 0, 'E');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, robotPos, mazeMap, mazeWon, currentLevel]);

  // ==========================================
  // GAME 2: BUG HUNTER STATE & MULTI-LANE FIX
  // ==========================================
  const [currentWaveIdx, setCurrentWaveIdx] = useState(0);
  const currentWave = BUG_WAVES[currentWaveIdx];

  const [bugScore, setBugScore] = useState(0);
  const [bugLives, setBugLives] = useState(3);
  const [bugGameOver, setBugGameOver] = useState(false);
  const [waveWon, setWaveWon] = useState(false);
  const [fallingCode, setFallingCode] = useState<Array<{ 
    id: number; 
    text: string; 
    isBug: boolean; 
    errorNote: string;
    lane: number; // 0, 1, 2 for distinct non-overlapping lanes
    y: number 
  }>>([]);

  const startBugHunterWave = (waveIdx: number) => {
    sound.playClick();
    setCurrentWaveIdx(waveIdx);
    setBugScore(0);
    setBugLives(3);
    setBugGameOver(false);
    setWaveWon(false);
    setFallingCode([]);
  };

  const handleNextWave = () => {
    const nextWave = (currentWaveIdx + 1) % BUG_WAVES.length;
    startBugHunterWave(nextWave);
  };

  // Multi-lane falling code physics
  useEffect(() => {
    if (activeGame !== 'bughunter' || bugGameOver || waveWon) return;

    // Spawner
    const spawnTimer = setInterval(() => {
      const template = currentWave.snippets[Math.floor(Math.random() * currentWave.snippets.length)];
      const randomLane = Math.floor(Math.random() * 3); // 0, 1, or 2

      setFallingCode(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          text: template.text,
          isBug: template.isBug,
          errorNote: template.errorNote,
          lane: randomLane,
          y: 0
        }
      ]);
    }, currentWave.spawnRate);

    // Fall gravity tick
    const fallTimer = setInterval(() => {
      setFallingCode(prev => {
        const next = [];
        let livesLost = 0;

        for (const item of prev) {
          const ny = item.y + currentWave.speed;

          if (ny >= 260) {
            // Hit firewall bottom
            if (item.isBug) {
              livesLost++;
              sound.playError();
            }
          } else {
            next.push({ ...item, y: ny });
          }
        }

        if (livesLost > 0) {
          setBugLives(l => {
            const nl = l - livesLost;
            if (nl <= 0) {
              setBugGameOver(true);
              sound.playError();
              return 0;
            }
            return nl;
          });
        }

        return next;
      });
    }, 200);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(fallTimer);
    };
  }, [activeGame, bugGameOver, waveWon, currentWave]);

  // Zap snippet action
  const zapCode = (id: number, isBug: boolean) => {
    if (isBug) {
      sound.playSuccess();
      sound.playClick();
      setBugScore(s => {
        const ns = s + 25;
        if (ns >= currentWave.targetScore) {
          setWaveWon(true);
          sound.playLevelUp();
          confetti({ particleCount: 80 });
          try {
            api.submitCode(`bughunter-wave-${currentWave.wave}`, `wave_${currentWave.wave}`, 'javascript', user?.id || 'demo');
            refreshUser();
          } catch {}
        }
        return ns;
      });
    } else {
      // Penalize for zapping valid code!
      sound.playError();
      setBugLives(l => {
        const nl = l - 1;
        if (nl <= 0) {
          setBugGameOver(true);
          return 0;
        }
        return nl;
      });
    }

    setFallingCode(prev => prev.filter(c => c.id !== id));
  };

  // ==========================================
  // GAME 3: STACK TOWER CHALLENGE (LIFO)
  // ==========================================
  const [stackItems, setStackItems] = useState<string[]>(['int a = 1;', 'call func()']);
  const [stackTarget] = useState<string>('Empty the Stack in true LIFO order!');
  const [stackScore, setStackScore] = useState(0);

  const pushToStack = (item: string) => {
    sound.playClick();
    if (stackItems.length >= 6) {
      sound.playError();
      return;
    }
    setStackItems(prev => [...prev, item]);
  };

  const popFromStack = () => {
    if (stackItems.length === 0) {
      sound.playError();
      return;
    }
    sound.playSuccess();
    setStackItems(prev => prev.slice(0, prev.length - 1));
    setStackScore(s => s + 20);
  };

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

  return (
    <div className="min-h-screen bg-[#060a14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-semibold mb-3">
          <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive 2D Arcade & Algorithmic Minigames</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-gaming tracking-tight text-white">
          2D PUZZLE ARENA
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal">
          Train your loop navigation instincts, detect syntax bugs in real-time, and master the Call Stack.
        </p>
      </div>

      {/* Game Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { id: 'maze', label: '1. Robot Grid Runner (Maze)', icon: Cpu, badge: `Level ${currentLevel.id}/3` },
          { id: 'bughunter', label: '2. Bug Zap: Syntax Sentry', icon: Bug, badge: `Wave ${currentWave.wave}/3` },
          { id: 'stack', label: '3. Call Stack Tower (LIFO)', icon: Layers, badge: 'Data Structures' },
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
              className={`px-5 py-3 rounded-2xl border font-gaming text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-950/90 border-cyan-400 text-cyan-300 shadow-neon-cyan scale-105'
                  : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 text-cyan-400" />
              <span>{g.label}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-purple-300 border border-purple-800/40 font-mono">
                {g.badge}
              </span>
            </button>
          );
        })}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="px-4 py-3 rounded-2xl border border-purple-800 bg-[#0a0f1d] text-purple-300 hover:text-white hover:border-cyan-400 font-gaming text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>
      </div>

      {/* Main Arcade Viewport Box */}
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#0b1020] border border-purple-900/60 shadow-2xl relative">
        
        {/* ======================================================== */}
        {/* GAME 1: ROBOT GRID RUNNER (WITH MULTI-LEVEL SYSTEM) */}
        {/* ======================================================== */}
        {activeGame === 'maze' && (
          <div className="space-y-6">
            
            {/* Top Bar with Level Selectors */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-gaming text-white">
                    {currentLevel.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/50 text-[10px] font-mono">
                    {currentLevel.topic}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Collect all <b className="text-yellow-400">{currentLevel.totalGems} gems</b> [💎] and enter the exit terminal [⚡].
                </p>
              </div>

              {/* Level Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">SELECT:</span>
                {MAZE_LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.id}
                    onClick={() => loadMazeLevel(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-gaming font-bold transition-all cursor-pointer ${
                      currentLevelIdx === idx
                        ? 'bg-cyan-500 text-black shadow-neon-cyan'
                        : 'bg-black/60 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    L{lvl.id}
                  </button>
                ))}

                <button
                  onClick={resetCurrentLevel}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-mono transition-colors ml-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/50 border border-purple-900/40 text-xs font-mono">
              <span className="text-cyan-300">Total Steps: <strong>{stepCount}</strong></span>
              <span className="text-yellow-400">Gems: <strong>{gemsCollected}/{currentLevel.totalGems}</strong></span>
              <span className="text-emerald-400">Reward: <strong>+{currentLevel.xpReward} XP</strong></span>
            </div>

            {/* Dynamic Grid Board */}
            <div className="flex justify-center overflow-x-auto py-2">
              <div 
                className="grid gap-1.5 p-4 rounded-2xl bg-[#060a14] border border-purple-900/60 shadow-inner"
                style={{ gridTemplateColumns: `repeat(${currentLevel.size}, minmax(0, 1fr))` }}
              >
                {mazeMap.map((row, r) =>
                  row.map((cell, c) => {
                    const isRobot = robotPos.x === c && robotPos.y === r;
                    const isWall = cell === 1;
                    const isGem = cell === 2;
                    const isExit = cell === 3;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base select-none transition-all ${
                          isRobot
                            ? 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-black shadow-neon-cyan scale-110 z-10'
                            : isWall
                            ? 'bg-slate-900/90 border border-slate-800'
                            : isGem
                            ? 'bg-purple-950/60 border border-purple-500/60'
                            : isExit
                            ? 'bg-emerald-950/80 border border-emerald-400'
                            : 'bg-[#0a0f1d] border border-slate-800/40'
                        }`}
                      >
                        {isRobot ? '🤖' : isWall ? '🧱' : isGem ? '💎' : isExit ? '⚡' : ''}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Directional Pad */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => moveRobot(0, -1, 'N')}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" /> NORTH (W)
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => moveRobot(-1, 0, 'W')}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> WEST (A)
                </button>
                <button
                  onClick={() => moveRobot(0, 1, 'S')}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" /> SOUTH (S)
                </button>
                <button
                  onClick={() => moveRobot(1, 0, 'E')}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-gaming text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  EAST (D) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* VICTORY MODAL WITH NEXT LEVEL BUTTON */}
            {mazeWon && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border border-emerald-400 text-center shadow-2xl animate-fadeIn">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-bounce" />
                <h4 className="text-xl sm:text-2xl font-bold font-gaming text-white">
                  🎉 {currentLevel.name} Conquered!
                </h4>
                <p className="text-xs text-emerald-200 mt-1">
                  Finished in <b className="text-white">{stepCount} steps</b> with all gems collected!
                </p>
                <div className="mt-2 text-sm font-mono text-cyan-300 font-bold">
                  +{currentLevel.xpReward} XP & +50 Coins Awarded!
                </div>

                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={resetCurrentLevel}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-gaming text-xs font-semibold"
                  >
                    Replay Level
                  </button>

                  <button
                    onClick={handleNextLevel}
                    className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-gaming text-xs font-black shadow-lg shadow-emerald-500/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <span>NEXT LEVEL ▶</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* GAME 2: BUG HUNTER (WITH MULTI-LANE & NEXT WAVE) */}
        {/* ======================================================== */}
        {activeGame === 'bughunter' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-gaming text-white">
                    {currentWave.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-600/50 text-[10px] font-mono">
                    Target: {currentWave.targetScore} Pts
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click to <b className="text-rose-400">zap bug statements</b> before they hit the firewall! Let valid code pass.
                </p>
              </div>

              {/* Wave Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">WAVE:</span>
                {BUG_WAVES.map((w, idx) => (
                  <button
                    key={w.wave}
                    onClick={() => startBugHunterWave(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-gaming font-bold transition-all cursor-pointer ${
                      currentWaveIdx === idx
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-black/60 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    W{w.wave}
                  </button>
                ))}

                <button
                  onClick={() => startBugHunterWave(currentWaveIdx)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 font-mono transition-colors ml-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restart
                </button>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/50 border border-purple-900/40 text-xs font-mono">
              <span className="text-yellow-400">Score: <strong>{bugScore}/{currentWave.targetScore}</strong></span>
              <span className="text-rose-400">Shields: <strong>{'❤️ '.repeat(bugLives)}</strong></span>
              <span className="text-cyan-300">Falling Speed: <strong>{currentWave.speed}px/t</strong></span>
            </div>

            {/* 3-Lane Falling Arcade Box */}
            <div className="relative h-80 rounded-2xl bg-[#060a14] border border-purple-900/60 overflow-hidden flex flex-col justify-between p-3">
              
              {/* Lane Grid Guides */}
              <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-20">
                <div className="border-r border-slate-700" />
                <div className="border-r border-slate-700" />
                <div />
              </div>

              {/* Falling Snippets */}
              <div className="relative w-full h-full">
                {fallingCode.map((item) => {
                  const lanePercentages = ['18%', '50%', '82%'];
                  return (
                    <button
                      key={item.id}
                      onClick={() => zapCode(item.id, item.isBug)}
                      style={{ 
                        top: `${item.y}px`, 
                        left: lanePercentages[item.lane],
                        transform: 'translateX(-50%)'
                      }}
                      className="absolute px-3 py-1.5 rounded-xl bg-purple-950/95 border border-purple-500 text-cyan-300 font-mono text-[11px] shadow-lg hover:border-rose-400 hover:bg-rose-950 hover:text-white transition-all cursor-crosshair group flex items-center gap-1.5 z-10"
                    >
                      <span>{item.text}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/60 text-slate-400 group-hover:text-rose-300">
                        ZAP
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Firewall Base Floor */}
              <div className="w-full py-2 bg-gradient-to-r from-purple-950 via-cyan-950 to-purple-950 border-t border-cyan-500/50 text-center text-[11px] font-mono text-cyan-400 uppercase tracking-widest relative z-20">
                🛡️ Memory Protection Firewall Active
              </div>

              {/* Victory or Game Over Overlay */}
              {(waveWon || bugGameOver) && (
                <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  {waveWon ? (
                    <>
                      <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
                      <h4 className="text-xl font-bold font-gaming text-emerald-400">
                        {currentWave.title} Purged!
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        All bugs eliminated before memory stack corruption.
                      </p>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => startBugHunterWave(currentWaveIdx)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-gaming text-xs"
                        >
                          Replay Wave
                        </button>
                        <button
                          onClick={handleNextWave}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-gaming text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer"
                        >
                          <span>NEXT WAVE ▶</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-12 h-12 text-rose-500 mb-2 animate-pulse" />
                      <h4 className="text-xl font-bold font-gaming text-rose-400">
                        Memory Stack Overflow!
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Bugs penetrated the firewall and depleted your shields.
                      </p>
                      <button
                        onClick={() => startBugHunterWave(currentWaveIdx)}
                        className="mt-4 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-gaming text-xs font-bold shadow-lg cursor-pointer"
                      >
                        Try Wave Again
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* GAME 3: CALL STACK TOWER CHALLENGE (LIFO) */}
        {/* ======================================================== */}
        {activeGame === 'stack' && (
          <div className="space-y-6">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold font-gaming text-white">
                Call Stack Tower: LIFO Operations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Understand how computers execute function calls using <b className="text-cyan-400">Last-In, First-Out (LIFO)</b> stacks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Stack Visualizer */}
              <div className="h-72 p-4 rounded-2xl bg-[#060a14] border border-purple-900/60 flex flex-col justify-end gap-2 relative">
                <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500">
                  TOP OF STACK ▲
                </div>

                {stackItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                    [ Stack is empty ]
                  </div>
                ) : (
                  stackItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl font-mono text-xs text-center border shadow-md transition-all ${
                        idx === stackItems.length - 1
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 animate-pulse font-bold'
                          : 'bg-purple-950/60 border-purple-800 text-purple-300'
                      }`}
                    >
                      {item} {idx === stackItems.length - 1 && '◀ [TOP]'}
                    </div>
                  ))
                )}

                <div className="w-full py-1.5 bg-slate-900/80 rounded-lg text-center text-[10px] font-mono text-slate-400 border border-slate-800">
                  BASE OF STACK
                </div>
              </div>

              {/* Stack Controls */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/40 text-xs font-mono space-y-2">
                  <div className="text-cyan-300 font-bold">STACK OPERATIONS:</div>
                  <p className="text-slate-400 text-[11px]">
                    <b>PUSH</b> adds a new frame to the TOP.<br />
                    <b>POP</b> removes the most recent frame from the TOP.
                  </p>
                  <div className="text-yellow-400 font-bold">Score: {stackScore} Pts</div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => pushToStack('computeResult()')}
                      className="flex-1 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-white font-gaming text-xs font-bold cursor-pointer"
                    >
                      PUSH: computeResult()
                    </button>
                    <button
                      onClick={() => pushToStack('allocateBuffer()')}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-white font-gaming text-xs font-bold cursor-pointer"
                    >
                      PUSH: allocateBuffer()
                    </button>
                  </div>

                  <button
                    onClick={popFromStack}
                    disabled={stackItems.length === 0}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-gaming text-xs font-black shadow-lg cursor-pointer"
                  >
                    POP FROM TOP (Execute & Return)
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
