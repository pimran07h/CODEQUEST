import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import type { Language } from '../types';
import { 
  User, 
  ShieldCheck, 
  Flame, 
  Coins, 
  Trophy, 
  Sparkles, 
  Code2, 
  Cpu, 
  Palette, 
  Check, 
  Swords, 
  LogOut,
  Calendar
} from 'lucide-react';

const SKINS = [
  { id: 'neon-cyan', name: 'Neon Cyan Matrix', border: 'border-cyan-400', glow: 'shadow-neon-cyan', color: 'from-cyan-500 to-blue-600' },
  { id: 'arcane-purple', name: 'Arcane Void', border: 'border-purple-400', glow: 'shadow-neon-purple', color: 'from-purple-600 to-indigo-600' },
  { id: 'emerald-glow', name: 'Verdant Cyber', border: 'border-emerald-400', glow: 'shadow-neon-emerald', color: 'from-emerald-500 to-teal-600' },
  { id: 'solar-amber', name: 'Solar Flare', border: 'border-amber-400', glow: 'shadow-neon-gold', color: 'from-amber-500 to-orange-600' }
];

const AVATARS = [
  { id: 'avatar-cyber-ninja', name: 'Cyber Ninja', icon: '🥷', desc: 'Syntax assassin' },
  { id: 'avatar-arcane-sorceress', name: 'Arcane Sorceress', icon: '🧙‍♀️', desc: 'Recursive magic' },
  { id: 'avatar-mecha-knight', name: 'Mecha Knight', icon: '🤖', desc: 'OOP tank' },
  { id: 'avatar-cyber-hacker', name: 'System Infiltrator', icon: '👾', desc: 'Algorithm master' }
];

export const ProfilePage: React.FC = () => {
  const { user, updatePreferences, logout } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(user?.preferredLanguage || 'javascript');

  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  const xpBaseForCurrentLevel = Math.pow(currentLevel - 1, 2) * 25;
  const xpRequiredForNextLevel = Math.pow(currentLevel, 2) * 25;
  const levelProgress = Math.min(100, Math.max(5, Math.round(((currentXp - xpBaseForCurrentLevel) / (xpRequiredForNextLevel - xpBaseForCurrentLevel || 100)) * 100)));

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    updatePreferences({ preferredLanguage: lang });
  };

  const handleSkinChange = (skinId: string) => {
    updatePreferences({ skin: skinId });
  };

  const handleAvatarChange = (avatarId: string) => {
    updatePreferences({ avatar: avatarId });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#121f42] to-[#0a1224] border border-purple-900/50 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-neon-purple shrink-0">
              <div className="w-full h-full bg-[#080d1a] rounded-[22px] flex items-center justify-center text-5xl">
                {user?.avatar === 'avatar-arcane-sorceress' ? '🧙‍♀️' :
                 user?.avatar === 'avatar-mecha-knight' ? '🤖' :
                 user?.avatar === 'avatar-cyber-hacker' ? '👾' : '🥷'}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-bold font-gaming text-white">{user?.name}</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  LVL {user?.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{user?.email}</p>
              <p className="text-xs text-purple-300 font-mono mt-0.5">
                {user?.college} • {user?.year} ({user?.branch})
              </p>

              {/* XP progress bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-48 sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  {currentXp} XP ({levelProgress}%)
                </span>
              </div>
            </div>
          </div>

          {/* Logout & Quick Stats */}
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-rose-500 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout Session
            </button>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> {user?.streakDays}d Streak
              </span>
              <span className="px-2 py-1 rounded bg-yellow-950/60 border border-yellow-800 text-yellow-300 font-bold flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" /> {user?.coins} Coins
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Customization Locker & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Customization Locker (Avatar & Skins) */}
        <div className="p-6 rounded-3xl bg-[#0c1326] border border-purple-900/40 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold font-gaming text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Cosmetic Skin Locker</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Unlock & customize your character border theme.</p>
          </div>

          {/* Skin options */}
          <div className="grid grid-cols-2 gap-3">
            {SKINS.map((skin) => (
              <button
                key={skin.id}
                onClick={() => handleSkinChange(skin.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  user?.skin === skin.id
                    ? `${skin.border} bg-[#080d1a] ${skin.glow}`
                    : 'border-slate-800 bg-[#070b14] hover:border-slate-700'
                }`}
              >
                <div className={`w-full h-3 rounded-full bg-gradient-to-r ${skin.color} mb-2`} />
                <span className="text-xs font-bold font-gaming text-white block">{skin.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {user?.skin === skin.id ? 'Equipped ✓' : 'Equip Skin'}
                </span>
              </button>
            ))}
          </div>

          {/* Avatar options */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-gaming mb-2">
              Switch Cyber Avatar
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleAvatarChange(av.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    user?.avatar === av.id
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-neon-cyan'
                      : 'border-slate-800 bg-[#070b14] hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{av.icon}</div>
                  <div className="text-[11px] font-bold text-white line-clamp-1">{av.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Weapon (Language) Switcher */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-gaming mb-2">
              Primary Programming Weapon
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 font-mono text-xs">
              {(['c', 'cpp', 'python', 'java', 'javascript'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`py-2 px-1 rounded-xl border text-center uppercase font-bold transition-all ${
                    user?.preferredLanguage === lang
                      ? 'bg-purple-950 border-purple-500 text-cyan-300 shadow-neon-purple'
                      : 'bg-[#070b14] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Engineering Stats & Language Proficiency */}
        <div className="p-6 rounded-3xl bg-[#0c1326] border border-purple-900/40 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold font-gaming text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Skill Matrix & Language Mastery</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Estimated proficiency based on passed test cases.</p>
          </div>

          {/* Language proficiency progress bars */}
          <div className="space-y-4 text-xs font-mono">
            {[
              { lang: 'C & C++ (STL / Pointers)', pct: 85, color: 'from-blue-500 to-cyan-400' },
              { lang: 'Python (Data Structures & Logic)', pct: 90, color: 'from-emerald-500 to-teal-400' },
              { lang: 'Java (OOP Architecture & JVM)', pct: 70, color: 'from-amber-500 to-orange-400' },
              { lang: 'JavaScript (Algorithms & Async)', pct: 95, color: 'from-purple-500 to-pink-500' }
            ].map((skill, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>{skill.lang}</span>
                  <span className="font-bold text-cyan-300">{skill.pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${skill.color} rounded-full`} style={{ width: `${skill.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Combat & Problem Statistics */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Missions Solved</span>
              <p className="text-xl font-bold font-gaming text-cyan-300 mt-0.5">{user?.completedChallenges.length || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">1v1 Victories</span>
              <p className="text-xl font-bold font-gaming text-rose-400 mt-0.5">{user?.battleStats.victories || 0}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Quizzes Won</span>
              <p className="text-xl font-bold font-gaming text-amber-400 mt-0.5">{user?.battleStats.quizzesWon || 0}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
