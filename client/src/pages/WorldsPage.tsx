import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { api } from '../services/api';
import type { World, Challenge } from '../types';
import { 
  Compass, 
  Lock, 
  CheckCircle2, 
  Star, 
  ShieldAlert, 
  ChevronRight, 
  Sparkles, 
  Code2, 
  Skull,
  Coins,
  ArrowRight
} from 'lucide-react';

export const WorldsPage: React.FC = () => {
  const { user } = useAuth();
  const { worldId } = useParams();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<number>(worldId ? parseInt(worldId) : 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWorlds()
      .then(res => {
        if (res.success) {
          setWorlds(res.worlds);
          if (worldId) setSelectedWorldId(parseInt(worldId));
        }
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, [worldId]);

  const currentWorld = worlds.find(w => w.id === selectedWorldId) || worlds[0];

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Worlds Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-600/40 text-purple-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive World Map • Play. Code. Conquer.</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-gaming text-white">
          The Six Coding Realms
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Select a world to embark on curated algorithmic missions, collect XP and coins, and defeat each realm's final Boss Titan.
        </p>
      </div>

      {/* World Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {worlds.map((w) => {
          const isSelected = w.id === selectedWorldId;
          const isUnlocked = user?.unlockedWorlds.includes(w.id);
          const completedCount = w.challenges.filter(c => user?.completedChallenges.includes(c.id)).length;

          return (
            <button
              key={w.id}
              onClick={() => {
                sound.playClick();
                setSelectedWorldId(w.id);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#121c38] border-cyan-400 shadow-neon-cyan'
                  : isUnlocked
                  ? 'bg-[#090e1a] border-purple-900/40 hover:border-slate-600'
                  : 'bg-[#060910] border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400">WORLD {w.id}</span>
                {isUnlocked ? (
                  <span className="text-[10px] text-emerald-400 font-bold">{completedCount}/{w.challenges.length}</span>
                ) : (
                  <Lock className="w-3 h-3 text-slate-500" />
                )}
              </div>
              <p className="text-xs font-bold font-gaming text-white line-clamp-1">{w.name}</p>
              <p className="text-[10px] text-purple-300 font-mono mt-0.5 line-clamp-1">Boss: {w.bossName}</p>
            </button>
          );
        })}
      </div>

      {/* Selected World Showcase */}
      {currentWorld && (
        <div className="space-y-6">
          
          {/* Realm Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#121f42] to-[#0a1224] border border-purple-900/50 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold font-mono">
                    WORLD {currentWorld.id}
                  </span>
                  <span className="text-xs text-purple-300 font-mono font-semibold">
                    {currentWorld.subtitle}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-gaming text-white">
                  {currentWorld.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {currentWorld.description}
                </p>

                {/* Topics Pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentWorld.topics.map((topic, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 border border-purple-900/50 text-slate-300 font-mono">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Boss Titan Showcase Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1a0f28] to-[#0c0816] border border-rose-600/50 text-center shrink-0 w-full lg:w-72 shadow-lg">
                <div className="inline-flex p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 mb-2">
                  <Skull className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-rose-300">Final Boss Titan</p>
                <h3 className="text-lg font-bold font-gaming text-white mt-0.5">{currentWorld.bossName}</h3>
                <p className="text-xs text-slate-400">{currentWorld.bossTitle}</p>
                <div className="mt-3 py-1.5 px-3 rounded-lg bg-black/40 border border-rose-900/40 text-xs text-rose-300 font-mono">
                  Boss Reward: +200 XP • +100 Coins
                </div>
              </div>
            </div>
          </div>

          {/* Levels & Coding Missions List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-gaming text-white">
                Missions & Checkpoints ({currentWorld.challenges.length} Stages)
              </h3>
              <span className="text-xs text-slate-400">
                Playing as: <strong className="text-cyan-300 uppercase font-mono">{user?.preferredLanguage}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWorld.challenges.map((challenge) => {
                const isCompleted = user?.completedChallenges.includes(challenge.id);
                const isBoss = challenge.isBoss;

                return (
                  <div
                    key={challenge.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isBoss 
                        ? 'bg-gradient-to-r from-[#1c0d22] to-[#0d0716] border-rose-700/60 shadow-lg' 
                        : isCompleted
                        ? 'bg-[#0a1324] border-emerald-700/40'
                        : 'bg-[#0b1020] border-slate-800/80 hover:border-purple-600/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isBoss ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {isBoss ? 'FINAL BOSS' : `STAGE ${challenge.levelNumber}`}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            challenge.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-300' :
                            challenge.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </div>

                        {isCompleted && (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-4 h-4" /> Cleared
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold font-gaming text-white">{challenge.title}</h4>
                      <p className="text-xs text-purple-300 font-mono mt-0.5">{challenge.subtitle}</p>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {challenge.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span className="text-cyan-300 font-semibold">+{challenge.xpReward} XP</span>
                        <span className="text-yellow-400 font-semibold">+{challenge.coinReward} Coins</span>
                        <span>{challenge.testCases.length} Test Cases</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        Topics: {challenge.topics.join(', ')}
                      </span>
                      <Link
                        to={`/arena/${challenge.id}`}
                        onClick={() => sound.playClick()}
                        className={`px-4 py-2 rounded-xl text-white font-gaming text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                          isBoss 
                            ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/50' 
                            : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/40'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'REPLAY MISSION' : 'ENTER ARENA'}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
