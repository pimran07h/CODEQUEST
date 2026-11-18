import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ArrowLeft,
  Key,
  Lock,
  Unlock,
  Radio,
  Compass,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ==========================================
// DETERMINISTIC 100-LEVEL PROCEDURAL ENGINE
// ==========================================
interface MazeLevel {
  id: number;
  name: string;
  tier: string;
  topic: string;
  size: number;
  startX: number;
  startY: number;
  totalGems: number;
  xpReward: number;
  hasKey: boolean;
  hasTeleporter: boolean;
  hasPatrol: boolean;
  map: number[][]; // 0: path, 1: wall, 2: gem, 3: exit, 4: key, 5: locked_gate, 6: portalA, 7: portalB
}

// Seeded PRNG for 100% deterministic, reproducible mazes
function createRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate any level from 1 to 100 dynamically
function generateMazeLevel(levelId: number): MazeLevel {
  const rng = createRng(levelId * 3571 + 1337);

  // Determine size based on difficulty tiers
  let size = 7;
  let tier = "Tier 1: Novice Byte Trail";
  let topic = "Variables & While Loops";

  if (levelId > 80) {
    size = levelId === 100 ? 11 : 10;
    tier = levelId === 100 ? "👑 TITAN BOSS MATRIX" : "Tier 5: NP-Hard Quantum Core";
    topic = levelId === 100 ? "NP-Hard Complexity & Final Graduation" : "Dynamic Programming & Graphs";
  } else if (levelId > 60) {
    size = 10;
    tier = "Tier 4: OOP Citadel & Patrol Bots";
    topic = "Classes, State & Memory Encapsulation";
  } else if (levelId > 40) {
    size = 9;
    tier = "Tier 3: Function Forest & Wormholes";
    topic = "Functions, Modularity & Quantum Recursion";
  } else if (levelId > 20) {
    size = 8;
    tier = "Tier 2: Logic Gate Labyrinth";
    topic = "Nested Loops, Booleans, Keys & Locks";
  }

  const hasKey = levelId >= 21;
  const hasTeleporter = levelId >= 45;
  const hasPatrol = levelId >= 65;

  // 1. Initialize filled with walls
  const map: number[][] = Array.from({ length: size }, () => Array(size).fill(1));

  // 2. Guaranteed Path from (0,0) to (size-1, size-1)
  let cx = 0;
  let cy = 0;
  map[cy][cx] = 0;

  const mainPathCoords: [number, number][] = [[0, 0]];
  while (cx < size - 1 || cy < size - 1) {
    if (cx === size - 1) {
      cy++;
    } else if (cy === size - 1) {
      cx++;
    } else {
      if (rng() > 0.5) cx++;
      else cy++;
    }
    map[cy][cx] = 0;
    mainPathCoords.push([cx, cy]);
  }

  // 3. Carve secondary open corridors and branches
  const branchCount = Math.floor(size * 2.4);
  for (let b = 0; b < branchCount; b++) {
    const [startBx, startBy] = mainPathCoords[Math.floor(rng() * mainPathCoords.length)];
    let bx = startBx;
    let by = startBy;
    const branchLen = 2 + Math.floor(rng() * 4);

    for (let step = 0; step < branchLen; step++) {
      const dir = Math.floor(rng() * 4);
      if (dir === 0 && by > 0) by--;
      else if (dir === 1 && by < size - 1) by++;
      else if (dir === 2 && bx > 0) bx--;
      else if (dir === 3 && bx < size - 1) bx++;
      map[by][bx] = 0;
    }
  }

  // 4. Set Exit Terminal at bottom-right
  map[size - 1][size - 1] = 3;

  // Collect available empty path cells
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (map[r][c] === 0 && !(r === 0 && c === 0) && !(r === size - 1 && c === size - 1)) {
        emptyCells.push([c, r]);
      }
    }
  }

  // Shuffle empty cells
  for (let i = emptyCells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
  }

  // 5. Place Gems
  const gemCount = Math.min(emptyCells.length - 4, Math.min(8, 3 + Math.floor(levelId / 15)));
  for (let g = 0; g < gemCount; g++) {
    if (emptyCells.length > 0) {
      const [gx, gy] = emptyCells.pop()!;
      map[gy][gx] = 2; // Gem
    }
  }

  // 6. Place Keycard & Gate if enabled
  if (hasKey && emptyCells.length > 2) {
    const [kx, ky] = emptyCells.pop()!;
    map[ky][kx] = 4; // Key

    // Place locked gate on cell adjacent to exit
    if (map[size - 2][size - 1] === 0) {
      map[size - 2][size - 1] = 5;
    } else if (map[size - 1][size - 2] === 0) {
      map[size - 1][size - 2] = 5;
    }
  }

  // 7. Place Teleporters if enabled
  if (hasTeleporter && emptyCells.length > 2) {
    const [pAx, pAy] = emptyCells.pop()!;
    const [pBx, pBy] = emptyCells.pop()!;
    map[pAy][pAx] = 6; // Portal A
    map[pBy][pBx] = 7; // Portal B
  }

  // Title calculation
  const titles = [
    "Corridor", "Matrix", "Chamber", "Labyrinth", "Loop", "Array", "Subroutine", "Sanctum", "Nexus"
  ];
  const name = levelId === 100 
    ? "Level 100: NP-Hard Boss Titan Core" 
    : `Level ${levelId}: ${titles[levelId % titles.length]} of Iteration`;

  const xpReward = 50 + levelId * 10;

  return {
    id: levelId,
    name,
    tier,
    topic,
    size,
    startX: 0,
    startY: 0,
    totalGems: gemCount,
    xpReward,
    hasKey,
    hasTeleporter,
    hasPatrol,
    map
  };
}

export const PuzzleArenaPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [activeGame, setActiveGame] = useState<'maze' | 'bughunter' | 'stack'>('maze');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ==========================================
  // 100-LEVEL MAZE STATE
  // ==========================================
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('codequest_max_level') || '1', 10);
  });
  const [showLevelSelectModal, setShowLevelSelectModal] = useState(false);
  const [levelSelectTier, setLevelSelectTier] = useState<number>(1); // 1 to 5

  const levelData = useMemo(() => generateMazeLevel(currentLevelId), [currentLevelId]);

  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [robotDir, setRobotDir] = useState<'N' | 'E' | 'S' | 'W'>('E');
  const [gemsCollected, setGemsCollected] = useState(0);
  const [hasKeycard, setHasKeycard] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [battery, setBattery] = useState(100);
  const [mazeWon, setMazeWon] = useState(false);
  const [mazeMap, setMazeMap] = useState<number[][]>(() => levelData.map.map(r => [...r]));

  // Re-initialize when level changes
  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  const loadLevel = (lvlId: number) => {
    const lvl = generateMazeLevel(lvlId);
    setRobotPos({ x: lvl.startX, y: lvl.startY });
    setRobotDir('E');
    setGemsCollected(0);
    setHasKeycard(false);
    setStepCount(0);
    setBattery(100);
    setMazeWon(false);
    setMazeMap(lvl.map.map(r => [...r]));
  };

  const handleNextLevel = () => {
    sound.playSuccess();
    const nextId = Math.min(100, currentLevelId + 1);
    setCurrentLevelId(nextId);
    if (nextId > highestUnlockedLevel) {
      setHighestUnlockedLevel(nextId);
      localStorage.setItem('codequest_max_level', String(nextId));
    }
  };

  // Robot Locomotion with Keycard, Teleport & Locked Gate handling
  const moveRobot = (dx: number, dy: number, dir: 'N' | 'E' | 'S' | 'W') => {
    if (mazeWon) return;
    const nx = robotPos.x + dx;
    const ny = robotPos.y + dy;

    // Bounds check
    if (nx < 0 || nx >= levelData.size || ny < 0 || ny >= levelData.size) {
      sound.playError();
      return;
    }

    const targetCell = mazeMap[ny][nx];

    // Wall check
    if (targetCell === 1) {
      sound.playError();
      return;
    }

    // Locked Gate check (5)
    if (targetCell === 5) {
      if (hasKeycard) {
        sound.playStoneRumble();
        // Unlock gate
        const newMap = mazeMap.map((row, r) =>
          row.map((cell, c) => (r === ny && c === nx ? 0 : cell))
        );
        setMazeMap(newMap);
      } else {
        sound.playError();
        return;
      }
    }

    // Move success
    sound.playMazeStep(currentLevelId);
    setRobotDir(dir);
    setRobotPos({ x: nx, y: ny });
    setStepCount(s => s + 1);
    setBattery(b => Math.max(0, b - 1));

    // Gem pickup (2)
    if (targetCell === 2) {
      sound.playGemPickup(gemsCollected + 1, currentLevelId);
      setGemsCollected(g => g + 1);
      setBattery(b => Math.min(100, b + 15));
      const newMap = mazeMap.map((row, r) =>
        row.map((cell, c) => (r === ny && c === nx ? 0 : cell))
      );
      setMazeMap(newMap);
    }

    // Keycard pickup (4)
    if (targetCell === 4) {
      sound.playTrickyChime();
      setHasKeycard(true);
      const newMap = mazeMap.map((row, r) =>
        row.map((cell, c) => (r === ny && c === nx ? 0 : cell))
      );
      setMazeMap(newMap);
    }

    // Portal Teleportation (6 -> 7 or 7 -> 6)
    if (targetCell === 6 || targetCell === 7) {
      sound.playTrickyChime();
      const lookFor = targetCell === 6 ? 7 : 6;
      for (let r = 0; r < levelData.size; r++) {
        for (let c = 0; c < levelData.size; c++) {
          if (mazeMap[r][c] === lookFor) {
            setRobotPos({ x: c, y: r });
            break;
          }
        }
      }
    }

    // Exit Reached (3)
    if (targetCell === 3) {
      sound.playMazeWin(currentLevelId);
      setMazeWon(true);
      confetti({ particleCount: 120, spread: 90 });

      // Unlock next level progress
      const nextUnlocked = Math.max(highestUnlockedLevel, Math.min(100, currentLevelId + 1));
      setHighestUnlockedLevel(nextUnlocked);
      localStorage.setItem('codequest_max_level', String(nextUnlocked));

      try {
        api.submitCode(`maze-lvl-${currentLevelId}`, `lvl_${currentLevelId}`, 'javascript', user?.id || 'demo');
        refreshUser();
      } catch {}
    }
  };

  // Keyboard controls without window scroll
  useEffect(() => {
    if (activeGame !== 'maze') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') moveRobot(0, -1, 'N');
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') moveRobot(0, 1, 'S');
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveRobot(-1, 0, 'W');
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRobot(1, 0, 'E');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, robotPos, mazeMap, mazeWon, levelData, hasKeycard]);

  // Fullscreen toggle
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
          <span>100-Level Algorithmic Arcade Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-gaming tracking-tight text-white uppercase">
          2D PUZZLE ARENA (100 LEVELS)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 font-normal">
          Conquer 100 progressive levels from novice loop corridors to the climactic NP-Hard Boss Titan.
        </p>
      </div>

      {/* Top Arcade Navigation & Level Select Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto">
        
        {/* Game Mode Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveGame('maze');
            }}
            className={`px-4 py-2.5 rounded-xl border font-gaming text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeGame === 'maze'
                ? 'bg-purple-950/90 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                : 'bg-[#0a0f1d] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>1. Robot Grid Runner (100 Levels)</span>
          </button>
        </div>

        {/* Level Select & Fullscreen Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowLevelSelectModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-gaming text-xs font-bold shadow-lg shadow-purple-900/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '15s' }} />
            <span>BROWSE ALL 100 LEVELS</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl border border-purple-800 bg-[#0a0f1d] text-purple-300 hover:text-white cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN GAME VIEWPORT (ROBOT GRID RUNNER WITH 100 LEVELS) */}
      {/* ======================================================== */}
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[#0b1020] border border-purple-900/60 shadow-2xl relative">
        
        {/* Level Info & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold">
                LEVEL {currentLevelId}/100
              </span>
              <h3 className="text-lg font-bold font-gaming text-white">
                {levelData.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
              <span className="text-purple-300 font-semibold">{levelData.tier}</span>
              <span>•</span>
              <span className="text-emerald-400">{levelData.topic}</span>
            </div>
          </div>

          {/* Quick Level Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentLevelId > 1) {
                  sound.playClick();
                  setCurrentLevelId(c => c - 1);
                }
              }}
              disabled={currentLevelId <= 1}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-xs font-mono font-bold cursor-pointer"
            >
              ◀ PREV
            </button>

            <span className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-600/40 text-xs font-mono text-cyan-300 font-bold">
              {currentLevelId} / 100
            </span>

            <button
              onClick={() => {
                if (currentLevelId < 100) {
                  sound.playClick();
                  setCurrentLevelId(c => c + 1);
                }
              }}
              disabled={currentLevelId >= 100}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-slate-700 hover:border-slate-500 disabled:opacity-30 text-xs font-mono font-bold cursor-pointer"
            >
              NEXT ▶
            </button>

            <button
              onClick={() => loadLevel(currentLevelId)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Live HUD Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-black/50 border border-purple-900/40 flex items-center justify-between">
            <span className="text-slate-400">Battery:</span>
            <span className={`font-bold ${battery < 25 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {battery}%
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-purple-900/40 flex items-center justify-between">
            <span className="text-slate-400">Gems:</span>
            <span className="text-yellow-400 font-bold">{gemsCollected}/{levelData.totalGems} 💎</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-purple-900/40 flex items-center justify-between">
            <span className="text-slate-400">Keycard:</span>
            <span className={hasKeycard ? "text-emerald-400 font-bold" : "text-slate-500"}>
              {hasKeycard ? "ACQUIRED 🔑" : (levelData.hasKey ? "LOCKED 🔒" : "NONE")}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/50 border border-purple-900/40 flex items-center justify-between">
            <span className="text-slate-400">Reward:</span>
            <span className="text-cyan-300 font-bold">+{levelData.xpReward} XP</span>
          </div>
        </div>

        {/* The 100-Level Dynamic Maze Grid */}
        <div className="flex justify-center overflow-x-auto py-2">
          <div 
            className="grid gap-1.5 p-4 rounded-2xl bg-[#060a14] border border-purple-900/60 shadow-inner"
            style={{ gridTemplateColumns: `repeat(${levelData.size}, minmax(0, 1fr))` }}
          >
            {mazeMap.map((row, r) =>
              row.map((cell, c) => {
                const isRobot = robotPos.x === c && robotPos.y === r;
                const isWall = cell === 1;
                const isGem = cell === 2;
                const isExit = cell === 3;
                const isKey = cell === 4;
                const isLockedGate = cell === 5;
                const isPortalA = cell === 6;
                const isPortalB = cell === 7;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base select-none transition-all ${
                      isRobot
                        ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-black shadow-neon-cyan scale-110 z-10'
                        : isWall
                        ? 'bg-slate-900/90 border border-slate-800'
                        : isGem
                        ? 'bg-purple-950/60 border border-purple-500/60'
                        : isExit
                        ? 'bg-emerald-950/80 border border-emerald-400 animate-pulse'
                        : isKey
                        ? 'bg-amber-950/80 border border-amber-400 animate-bounce'
                        : isLockedGate
                        ? 'bg-rose-950/80 border border-rose-500 text-rose-300'
                        : isPortalA || isPortalB
                        ? 'bg-indigo-950/80 border border-indigo-400 animate-pulse'
                        : 'bg-[#0a0f1d] border border-slate-800/40'
                    }`}
                  >
                    {isRobot ? '🤖' 
                      : isWall ? '🧱' 
                      : isGem ? '💎' 
                      : isExit ? '⚡' 
                      : isKey ? '🔑' 
                      : isLockedGate ? '🔒' 
                      : (isPortalA || isPortalB) ? '🌀' 
                      : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Directional Navigation Pad */}
        <div className="flex flex-col items-center gap-2 mt-4">
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
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/95 to-teal-950/95 border border-emerald-400 text-center shadow-2xl animate-fadeIn">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-xl sm:text-2xl font-bold font-gaming text-white">
              🎉 {levelData.name} CONQUERED!
            </h4>
            <p className="text-xs text-emerald-200 mt-1">
              Solved in <b className="text-white">{stepCount} steps</b> with {gemsCollected} mana gems collected!
            </p>
            <div className="mt-2 text-sm font-mono text-cyan-300 font-bold">
              +{levelData.xpReward} XP & +50 Coins Added to Profile!
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => loadLevel(currentLevelId)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-gaming text-xs font-semibold cursor-pointer"
              >
                Replay Level
              </button>

              <button
                onClick={handleNextLevel}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-gaming text-xs font-black shadow-lg shadow-emerald-500/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>NEXT LEVEL ▶ ({Math.min(100, currentLevelId + 1)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 100-LEVEL SELECTOR MODAL (BROWSE LEVELS 1 - 100) */}
      {/* ======================================================== */}
      {showLevelSelectModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-[#0a0f1d] border border-purple-600/60 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-900/60 pb-3 mb-4">
              <div>
                <h3 className="text-xl font-bold font-gaming text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Select Level (1 - 100)
                </h3>
                <p className="text-xs text-slate-400">
                  Highest Unlocked: <b className="text-cyan-300">Level {highestUnlockedLevel}</b>
                </p>
              </div>

              <button
                onClick={() => setShowLevelSelectModal(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Tier Tabs (1-20, 21-40, 41-60, 61-80, 81-100) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { tier: 1, label: 'Tier 1 (1 - 20)', desc: 'Novice Byte' },
                { tier: 2, label: 'Tier 2 (21 - 40)', desc: 'Logic Gates & Keys' },
                { tier: 3, label: 'Tier 3 (41 - 60)', desc: 'Function Portals' },
                { tier: 4, label: 'Tier 4 (61 - 80)', desc: 'OOP Citadel' },
                { tier: 5, label: 'Tier 5 (81 - 100)', desc: 'NP-Hard Boss' }
              ].map((t) => (
                <button
                  key={t.tier}
                  onClick={() => {
                    sound.playClick();
                    setLevelSelectTier(t.tier);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gaming font-semibold transition-all cursor-pointer ${
                    levelSelectTier === t.tier
                      ? 'bg-cyan-500 text-black shadow-neon-cyan font-bold'
                      : 'bg-black/60 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 20 Levels Grid for the selected Tier */}
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-5 gap-2.5 py-2">
              {Array.from({ length: 20 }, (_, i) => {
                const lvlNum = (levelSelectTier - 1) * 20 + (i + 1);
                const isCurrent = lvlNum === currentLevelId;
                const isUnlocked = lvlNum <= highestUnlockedLevel;
                const isBoss = lvlNum === 100;

                return (
                  <button
                    key={lvlNum}
                    onClick={() => {
                      sound.playClick();
                      setCurrentLevelId(lvlNum);
                      setShowLevelSelectModal(false);
                    }}
                    className={`p-3 rounded-2xl border text-center font-mono text-xs font-bold transition-all cursor-pointer relative overflow-hidden ${
                      isCurrent
                        ? 'bg-cyan-500 text-black border-cyan-300 shadow-neon-cyan scale-105'
                        : isBoss
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-lg'
                        : isUnlocked
                        ? 'bg-[#0f172a] border-purple-800/60 text-white hover:border-cyan-400 hover:scale-105'
                        : 'bg-black/40 border-slate-900 text-slate-600'
                    }`}
                  >
                    <div className="text-sm font-gaming font-black">
                      {isBoss ? '👑 100' : lvlNum}
                    </div>
                    <div className="text-[10px] mt-1 font-normal opacity-70">
                      {isBoss ? 'BOSS' : (lvlNum >= 45 ? '🌀 PORTAL' : (lvlNum >= 21 ? '🔑 KEY' : '💎 GEM'))}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
