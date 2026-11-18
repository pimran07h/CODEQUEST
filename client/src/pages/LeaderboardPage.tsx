import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import type { User } from '../types';
import { Trophy, Medal, Crown, Flame, Filter, Search, Award } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getLeaderboard({
      college: selectedCollege || undefined,
      year: selectedYear || undefined
    })
      .then(res => {
        if (res.success) setStudents(res.leaderboard);
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, [selectedYear, selectedCollege]);

  const topThree = students.slice(0, 3);
  const remaining = students.slice(3);

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-950/70 border border-yellow-600/40 text-yellow-300 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Hall of Grandmasters • Ranked Leaderboard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-gaming text-white">
          CodeQuest Grand Championship
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Rankings are calculated dynamically based on verified XP, boss titan takedowns, and multiplayer victories.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b1020] border border-purple-900/40">
        
        {/* Year Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-gaming font-semibold">
          {['', '1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
            <button
              key={yr}
              onClick={() => {
                sound.playClick();
                setSelectedYear(yr);
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedYear === yr
                  ? 'bg-purple-950 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {yr || 'All Years'}
            </button>
          ))}
        </div>

        {/* College Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            placeholder="Filter by college (IIT, BITS...)"
            className="w-full px-3.5 py-1.5 bg-[#070b14] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

      </div>

      {/* Top 3 Podium Showcase */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 items-end max-w-4xl mx-auto">
          
          {/* #2 Silver (Left) */}
          <div className="p-6 rounded-3xl bg-[#0c1326] border border-slate-500/50 text-center order-2 sm:order-1 shadow-lg relative">
            <span className="w-8 h-8 rounded-full bg-slate-300 text-black font-bold font-gaming flex items-center justify-center mx-auto mb-2 text-sm">
              2
            </span>
            <div className="text-3xl mb-1">🧙‍♀️</div>
            <h3 className="text-sm font-bold font-gaming text-white truncate">{topThree[1].name}</h3>
            <p className="text-[10px] text-slate-400 font-mono truncate">{topThree[1].college}</p>
            <div className="mt-3 py-1 rounded-lg bg-black/40 border border-slate-700 font-mono text-xs font-bold text-slate-300">
              {topThree[1].xp} XP
            </div>
          </div>

          {/* #1 Gold (Center, Elevated) */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#1f1738] to-[#0c1224] border border-yellow-500 text-center order-1 sm:order-2 shadow-2xl scale-105 z-10 relative">
            <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-bold font-gaming flex items-center justify-center mx-auto mb-2 text-base shadow-neon-gold">
              👑 1
            </div>
            <div className="text-4xl mb-1">🥷</div>
            <h3 className="text-base font-bold font-gaming text-yellow-300 truncate">{topThree[0].name}</h3>
            <p className="text-[11px] text-purple-300 font-mono truncate">{topThree[0].college}</p>
            <div className="mt-3 py-1.5 rounded-lg bg-yellow-950/60 border border-yellow-500/60 font-mono text-sm font-bold text-yellow-300">
              {topThree[0].xp} XP • Grandmaster
            </div>
          </div>

          {/* #3 Bronze (Right) */}
          <div className="p-6 rounded-3xl bg-[#0c1326] border border-amber-700/50 text-center order-3 shadow-lg relative">
            <span className="w-8 h-8 rounded-full bg-amber-600 text-black font-bold font-gaming flex items-center justify-center mx-auto mb-2 text-sm">
              3
            </span>
            <div className="text-3xl mb-1">🤖</div>
            <h3 className="text-sm font-bold font-gaming text-white truncate">{topThree[2].name}</h3>
            <p className="text-[10px] text-slate-400 font-mono truncate">{topThree[2].college}</p>
            <div className="mt-3 py-1 rounded-lg bg-black/40 border border-amber-900/50 font-mono text-xs font-bold text-amber-400">
              {topThree[2].xp} XP
            </div>
          </div>

        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl bg-[#0c1326] border border-purple-900/40 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#080d1a] border-b border-purple-900/40 text-slate-400 uppercase text-[10px] font-gaming tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student Knight</th>
                <th className="py-3 px-4">College / Batch</th>
                <th className="py-3 px-4">Weapon</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Missions</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((s, idx) => {
                const isMe = s.id === user?.id;
                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${
                      isMe 
                        ? 'bg-cyan-950/40 font-bold border-l-4 border-cyan-400' 
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <span className="text-lg">
                        {s.avatar === 'avatar-arcane-sorceress' ? '🧙‍♀️' :
                         s.avatar === 'avatar-mecha-knight' ? '🤖' :
                         s.avatar === 'avatar-cyber-hacker' ? '👾' : '🥷'}
                      </span>
                      <div>
                        <span className="text-white font-semibold font-gaming">{s.name}</span>
                        {isMe && <span className="ml-1.5 text-[10px] text-cyan-300 font-bold">(You)</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{s.college}</div>
                      <span className="text-[10px] text-slate-500">{s.year} • {s.branch?.split(' ')[0]}</span>
                    </td>
                    <td className="py-3 px-4 text-cyan-300 uppercase font-semibold">
                      {s.preferredLanguage}
                    </td>
                    <td className="py-3 px-4 text-purple-300 font-bold">
                      LVL {s.level}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.completedChallenges.length}
                    </td>
                    <td className="py-3 px-4 text-right text-yellow-400 font-bold text-sm">
                      {s.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
