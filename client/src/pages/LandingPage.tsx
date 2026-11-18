import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sound } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import { 
  Gamepad2, 
  Swords, 
  Code2, 
  Cpu, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  Flame, 
  Layers, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Radio, 
  Play, 
  Music,
  Compass,
  Puzzle,
  Shield,
  Zap,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isThemePlaying, setIsThemePlaying] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'modes' | 'worlds' | 'about'>('modes');

  // Sync theme music state
  useEffect(() => {
    // If user clicks or interacts, allow easy music start
    const handleFirstClick = () => {
      // Don't auto-start without user gesture
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, []);

  const toggleMusic = () => {
    const newState = sound.toggleBattleTheme();
    setIsThemePlaying(newState);
    sound.playClick();
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

  const handleEnterRealm = () => {
    sound.playGameStartImpact();
    if (!isThemePlaying) {
      sound.startBattleTheme();
      setIsThemePlaying(true);
    }
    setHasEntered(true);
  };

  return (
    <div className="min-h-screen bg-[#040711] text-white flex flex-col justify-between select-none overflow-x-hidden relative">
      
      {/* Dynamic Cyber Grid & Starfield Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-[#070b19] to-[#03060f] pointer-events-none" />
      
      {/* Scanline & Hologram Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      {/* Pulsing Light Glow Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-purple-600/25 to-pink-500/20 blur-[140px] rounded-full pointer-events-none" />

      {/* ======================================================== */}
      {/* TOP STATUS BAR (PUBG/FREE FIRE STYLE) */}
      {/* ======================================================== */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-purple-900/30 backdrop-blur-md bg-black/40">
        
        {/* Left: Game Title Badge & Version */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-900/50 flex items-center justify-center">
            <div className="w-full h-full bg-[#070b19] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-gaming tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-white text-lg">
                CODEQUEST
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-600/50 text-[10px] font-bold text-purple-300 font-mono">
                v1.0.0
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                ONLINE
              </span>
              <span>•</span>
              <span>ASIA (MUMBAI)</span>
              <span>•</span>
              <span className="text-cyan-400">18ms PING</span>
            </div>
          </div>
        </div>

        {/* Right: Audio Theme Controls & Fullscreen */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Animated PUBG/Free Fire Theme Song Button */}
          <button
            onClick={toggleMusic}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-gaming tracking-wide flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              isThemePlaying 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-pink-900/50 scale-105' 
                : 'bg-black/70 hover:bg-purple-950/80 border border-purple-800/60 text-purple-300'
            }`}
            title="Toggle Entry Battle Theme Song"
          >
            <Music className={`w-4 h-4 ${isThemePlaying ? 'animate-bounce text-yellow-300' : 'text-purple-400'}`} />
            <span className="hidden sm:inline">
              {isThemePlaying ? 'BATTLE THEME: ON' : 'PLAY BATTLE THEME'}
            </span>

            {/* Equalizer Waveform Bars */}
            <div className="flex items-end gap-0.5 h-3.5">
              <div className={`w-0.5 bg-yellow-300 transition-all ${isThemePlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
              <div className={`w-0.5 bg-cyan-300 transition-all ${isThemePlaying ? 'h-3.5 animate-bounce' : 'h-1.5'}`} />
              <div className={`w-0.5 bg-purple-300 transition-all ${isThemePlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
            </div>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => sound.toggleMute()}
            className="p-2.5 rounded-xl bg-black/70 hover:bg-purple-950/80 border border-purple-800/60 text-purple-300 hover:text-white transition-colors"
            title="Toggle All Sound"
          >
            {sound.isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-black/70 hover:bg-purple-950/80 border border-purple-800/60 text-purple-300 hover:text-white transition-colors hidden sm:block"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN HERO CENTERPIECE (AAA GAME LAUNCH EXPERIENCE) */}
      {/* ======================================================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-6xl mx-auto w-full">
        
        {/* Holographic Spinning Emblem */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-1 shadow-2xl shadow-cyan-500/30 animate-pulse">
            <div className="w-full h-full bg-[#060a17] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <Cpu className="w-12 h-12 text-cyan-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
            </div>
          </div>
          {/* Outer Rotating Energy Rings */}
          <div className="absolute -inset-2.5 rounded-[32px] border border-cyan-400/30 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute -inset-5 rounded-[40px] border border-purple-500/20 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
        </div>

        {/* Epic Game Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-gaming tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(139,92,246,0.6)]">
          CODE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">QUEST</span>
        </h1>

        {/* Dynamic Tagline */}
        <p className="mt-3 text-lg sm:text-2xl font-bold font-gaming tracking-widest text-cyan-300 uppercase drop-shadow-md">
          PLAY. CODE. CONQUER.
        </p>
        
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
          The next-generation gamified coding battlefield for B.Tech engineering students.
          Explore 3D cyber jungles, solve retro 2D logic mazes, and battle 1v1 live.
        </p>

        {/* ======================================================== */}
        {/* THE ICONIC "TAP TO START / ENTER THE REALM" BUTTON */}
        {/* ======================================================== */}
        {!hasEntered ? (
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={handleEnterRealm}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-gaming font-extrabold text-lg sm:text-xl tracking-wider shadow-2xl shadow-purple-600/60 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer border border-cyan-300/40 animate-bounce"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>TAP TO START • ENTER THE REALM</span>
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </button>
            <p className="text-xs text-slate-400 font-mono tracking-wide animate-pulse">
              [ Click to initialize sound engine & unlock battle arena ]
            </p>
          </div>
        ) : (
          /* ======================================================== */
          /* UNLOCKED GAME MODE SELECTION DOCK (LIKE PUBG/FREE FIRE) */
          /* ======================================================== */
          <div className="mt-8 w-full animate-fadeIn">
            
            <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold font-gaming text-cyan-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> SELECT YOUR MISSION MODE <Sparkles className="w-4 h-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-5xl mx-auto">
              
              {/* Mode 1: 3D Adventure (THE LOST TEMPLE) */}
              <Link
                to="/adventure"
                onClick={() => sound.playClick()}
                className="group p-5 rounded-2xl bg-gradient-to-b from-emerald-950/70 to-black/80 border border-emerald-500/50 hover:border-emerald-400 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-950/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 border-b border-l border-emerald-500/40 text-[10px] font-bold rounded-bl-xl font-mono">
                  PLAYABLE 3D
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-3 group-hover:rotate-6 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-gaming text-white group-hover:text-emerald-300 transition-colors">
                  Chapter 1: The Lost Temple
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Realistic 3D jungle exploration. Find the 3 Loop Relics with AI drone Byte and breach the ancient stone door!
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>ENTER 3D JUNGLE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Mode 2: 1v1 Battle Arena (Multiplayer) */}
              <Link
                to="/multiplayer"
                onClick={() => sound.playClick()}
                className="group p-5 rounded-2xl bg-gradient-to-b from-rose-950/70 to-black/80 border border-rose-500/50 hover:border-rose-400 hover:scale-[1.02] transition-all shadow-xl shadow-rose-950/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/20 text-rose-300 border-b border-l border-rose-500/40 text-[10px] font-bold rounded-bl-xl font-mono">
                  LIVE PVP
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 mb-3 group-hover:rotate-6 transition-transform">
                  <Swords className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-gaming text-white group-hover:text-rose-300 transition-colors">
                  1v1 Battle Arena & Quiz Royale
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Fast-paced synchronized multiplayer. Duel classmates in real-time or take the 4-player high-speed trivia quiz.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-rose-400">
                  <span>ENTER LIVE ARENA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Mode 3: 2D Puzzle Arena */}
              <Link
                to="/puzzles"
                onClick={() => sound.playClick()}
                className="group p-5 rounded-2xl bg-gradient-to-b from-cyan-950/70 to-black/80 border border-cyan-500/50 hover:border-cyan-400 hover:scale-[1.02] transition-all shadow-xl shadow-cyan-950/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-cyan-300 border-b border-l border-cyan-500/40 text-[10px] font-bold rounded-bl-xl font-mono">
                  RETRO ARCADE
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3 group-hover:rotate-6 transition-transform">
                  <Puzzle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-gaming text-white group-hover:text-cyan-300 transition-colors">
                  2D Puzzle Arcade
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Robot Grid Runner and Bug Zap. Master algorithm sequences and loop logic through interactive maze gameplay.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-cyan-400">
                  <span>PLAY PUZZLES</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Mode 4: Monaco Coding Arena */}
              <Link
                to="/arena"
                onClick={() => sound.playClick()}
                className="group p-5 rounded-2xl bg-gradient-to-b from-purple-950/70 to-black/80 border border-purple-500/50 hover:border-purple-400 hover:scale-[1.02] transition-all shadow-xl shadow-purple-950/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-purple-500/20 text-purple-300 border-b border-l border-purple-500/40 text-[10px] font-bold rounded-bl-xl font-mono">
                  SANDBOX IDE
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-3 group-hover:rotate-6 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-gaming text-white group-hover:text-purple-300 transition-colors">
                  Monaco Coding Arena & AI Tutor
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Full IDE supporting C, C++, Python, Java, JS with Professor Turing Socratic AI tutor and test case verification.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-400">
                  <span>OPEN IDE ARENA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Mode 5: The 6 Coding Worlds */}
              <Link
                to="/worlds"
                onClick={() => sound.playClick()}
                className="group p-5 rounded-2xl bg-gradient-to-b from-indigo-950/70 to-black/80 border border-indigo-500/50 hover:border-indigo-400 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-950/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500/20 text-indigo-300 border-b border-l border-indigo-500/40 text-[10px] font-bold rounded-bl-xl font-mono">
                  CAMPAIGN MAP
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 mb-3 group-hover:rotate-6 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-gaming text-white group-hover:text-indigo-300 transition-colors">
                  The Six Coding Realms
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  B.Tech 1st to 4th year curriculum map: Coding Village, Logic Dungeon, Function Forest, OOP City, and Algorithm Arena.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-400">
                  <span>EXPLORE WORLMS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Mode 6: Daily Quests & Leaderboard */}
              <Link
                to="/leaderboard"
                onClick={() => sound.playClick()}
                className="group p-5 rounded-2xl bg-gradient-to-b from-amber-950/70 to-black/80 border border-amber-500/50 hover:border-amber-400 hover:scale-[1.02] transition-all shadow-xl shadow-amber-950/40 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-amber-300 border-b border-l border-amber-500/40 text-[10px] font-bold rounded-bl-xl font-mono">
                  ESPORTS
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 group-hover:rotate-6 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold font-gaming text-white group-hover:text-amber-300 transition-colors">
                  All-India College Leaderboard
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Compete with engineering students from IITs, NITs, and top colleges across India. Earn badges and rank up!
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>VIEW STANDINGS</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* BOTTOM PLAYER HUD / FOOTER */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-3.5 border-t border-purple-900/30 backdrop-blur-md bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Player Profile Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'I'}
          </div>
          <div className="text-left font-mono">
            <div className="font-bold text-white flex items-center gap-2">
              <span>{user?.name || 'Dr. Imran (Explorer)'}</span>
              <span className="text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/40">
                LVL {user?.level || 3}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {user?.xp || 450} XP • {user?.coins || 180} Coins • 7-Day Flame Streak 🔥
            </div>
          </div>
        </div>

        {/* Center: Language Arsenal */}
        <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-500">ARSENAL:</span>
          {['C', 'C++', 'Python', 'Java', 'JavaScript'].map((lang) => (
            <span key={lang} className="px-2 py-0.5 rounded bg-slate-900 border border-purple-900/40 text-cyan-300 font-semibold">
              {lang}
            </span>
          ))}
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300 font-gaming">
          <Link to="/dashboard" className="hover:text-cyan-300 transition-colors">DASHBOARD</Link>
          <span>•</span>
          <Link to="/achievements" className="hover:text-purple-300 transition-colors">TROPHIES</Link>
          <span>•</span>
          <Link to="/admin" className="hover:text-emerald-300 transition-colors">ADMIN</Link>
        </div>

      </footer>

    </div>
  );
};
