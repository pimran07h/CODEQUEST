import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ShieldCheck, Terminal, Cpu, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050810] border-t border-purple-900/30 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#080d1a] rounded-[6px] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-gaming font-bold text-lg text-white">CODEQUEST</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Next-Gen Gamified Coding Arena for B.Tech students. Master C, C++, Python, Java & JavaScript through 3D adventures, 2D puzzles, and live multiplayer duels.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Core Game Server: Online</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 font-gaming mb-3">
              The 6 Worlds
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/worlds" className="hover:text-cyan-300 transition-colors">1. Coding Village</Link></li>
              <li><Link to="/worlds" className="hover:text-cyan-300 transition-colors">2. Logic Dungeon</Link></li>
              <li><Link to="/worlds" className="hover:text-cyan-300 transition-colors">3. Function Forest</Link></li>
              <li><Link to="/worlds" className="hover:text-cyan-300 transition-colors">4. OOP City</Link></li>
              <li><Link to="/worlds" className="hover:text-cyan-300 transition-colors">5. Data Structure Realm</Link></li>
              <li><Link to="/worlds" className="hover:text-cyan-300 transition-colors">6. Algorithm Arena</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 font-gaming mb-3">
              Arena Modes
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/adventure" className="hover:text-cyan-300 transition-colors">3D Cyber Adventure</Link></li>
              <li><Link to="/puzzles" className="hover:text-cyan-300 transition-colors">2D Phaser Puzzles</Link></li>
              <li><Link to="/arena" className="hover:text-cyan-300 transition-colors">Monaco Coding IDE</Link></li>
              <li><Link to="/multiplayer" className="hover:text-cyan-300 transition-colors">1v1 Code Duels</Link></li>
              <li><Link to="/quiz" className="hover:text-cyan-300 transition-colors">4-Player Quiz Royale</Link></li>
              <li><Link to="/daily" className="hover:text-cyan-300 transition-colors">Daily Streak Challenge</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 font-gaming mb-3">
              Curriculum & Engine
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Engineered specifically for B.Tech CS, IT, AI/DS, and ECE cohorts with isolated code execution sandbox and AI Tutor.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['C', 'C++', 'Python', 'Java', 'JavaScript'].map((lang) => (
                <span key={lang} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                  {lang}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <Link to="/admin" className="text-xs text-purple-400 hover:text-cyan-300 underline">
                Admin Control Room &rarr;
              </Link>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 CODEQUEST. Built for Future Tech Titans. Tagline: "Play. Code. Conquer."</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Web & Node.js VM Sandbox
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Isolated Execution
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
