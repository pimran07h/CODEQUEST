import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { 
  Gamepad2, 
  Swords, 
  Compass, 
  Code2, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Flame, 
  Coins, 
  Shield, 
  Menu, 
  X,
  Sparkles,
  Bot,
  Puzzle,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isMuted, toggleSound } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Calculate XP towards next level: each level requires level * 200 XP approx
  const currentLevel = user?.level || 1;
  const currentXp = user?.xp || 0;
  const xpBaseForCurrentLevel = Math.pow(currentLevel - 1, 2) * 25;
  const xpRequiredForNextLevel = Math.pow(currentLevel, 2) * 25;
  const levelProgress = Math.min(
    100,
    Math.max(5, Math.round(((currentXp - xpBaseForCurrentLevel) / (xpRequiredForNextLevel - xpBaseForCurrentLevel || 100)) * 100))
  );

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Shield },
    { to: '/worlds', label: 'Worlds', icon: Compass },
    { to: '/adventure', label: '3D Adventure', icon: Gamepad2, badge: '3D' },
    { to: '/puzzles', label: '2D Puzzles', icon: Puzzle, badge: 'Phaser' },
    { to: '/arena', label: 'Code Arena', icon: Code2 },
    { to: '/multiplayer', label: 'Multiplayer', icon: Swords, badge: 'LIVE' },
    { to: '/quiz', label: 'Quiz', icon: Sparkles },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080d1a]/90 backdrop-blur-md border-b border-purple-900/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={() => sound.playClick()}
          className="flex items-center gap-2.5 group transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-neon-purple flex items-center justify-center">
            <div className="w-full h-full bg-[#090d18] rounded-[7px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-gaming text-xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                CODEQUEST
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/50">
                B.TECH
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-mono">
              Play. Code. Conquer.
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => sound.playClick()}
                className={`relative px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-purple-950/80 text-cyan-300 border border-purple-600/50 shadow-sm shadow-purple-900/50' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {link.label}
                {link.badge && (
                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                    link.badge === 'LIVE' ? 'bg-rose-500 text-white animate-pulse' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Player HUD Pill */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#0d1424] border border-purple-900/40 rounded-xl px-2.5 py-1.5 shadow-inner">
              
              {/* Daily Streak */}
              <div 
                title={`Daily Coding Streak: ${user.streakDays} days!`}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-amber-950/40 rounded-md border border-amber-800/40 text-amber-300 text-xs font-semibold"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.streakDays}d</span>
              </div>

              {/* Coins */}
              <div 
                title={`Quest Coins: ${user.coins}`}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-yellow-950/30 rounded-md border border-yellow-800/40 text-yellow-300 text-xs font-semibold"
              >
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>{user.coins}</span>
              </div>

              {/* Level & XP */}
              <div className="flex flex-col items-end pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-gaming">
                    LVL {currentLevel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentXp} XP
                  </span>
                </div>
                {/* Mini XP progress bar */}
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>

              {/* Profile Avatar Link */}
              <Link
                to="/profile"
                onClick={() => sound.playClick()}
                title="View Student Profile"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center overflow-hidden">
                  <span className="text-xs font-bold text-cyan-300">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </Link>

            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-900/50"
            >
              Enter Game
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1d] border-b border-purple-900/50 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {link.label}
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-900 text-purple-200">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <Link to="/daily" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Daily Quest
            </Link>
            <Link to="/achievements" onClick={() => setMobileMenuOpen(false)} className="hover:text-purple-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-purple-400" /> Achievements
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
