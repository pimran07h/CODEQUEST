import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import { Code2, Shield, Lock, Mail, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('IIT Bombay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your student email.');
      sound.playError();
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login.');
      sound.playError();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    sound.playClick();
    setLoading(true);
    try {
      await login(demoEmail);
      navigate('/dashboard');
    } catch (err) {
      sound.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center px-4 py-16 hud-grid-bg">
      <div className="max-w-md w-full">
        
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <Link to="/" onClick={() => sound.playClick()} className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-neon-purple flex items-center justify-center">
              <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <span className="font-gaming text-2xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              CODEQUEST
            </span>
          </Link>
          <h2 className="text-xl font-bold font-gaming text-white">Student Terminal Login</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to resume your coding adventure.</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-[#0e1628]/90 border border-purple-900/40 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/70 border border-rose-700 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Student Email / Roll ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                College / Institution
              </label>
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="IIT Bombay">IIT Bombay</option>
                <option value="IIT Delhi">IIT Delhi</option>
                <option value="BITS Pilani">BITS Pilani</option>
                <option value="NIT Trichy">NIT Trichy</option>
                <option value="DTU Delhi">Delhi Technological University</option>
                <option value="Other Engineering College">Other Engineering College</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-gaming font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Enter Arena'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-purple-300 font-gaming uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              1-Click Demo Profiles
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('student@codequest.dev')}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 text-left text-xs text-slate-300 hover:text-cyan-300 flex items-center justify-between transition-colors"
              >
                <span className="font-medium">Alex Vance (2nd Yr CSE • Level 6)</span>
                <span className="text-[10px] text-purple-400 font-mono">Quick Enter &rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('priya@codequest.dev')}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-purple-400 text-left text-xs text-slate-300 hover:text-purple-300 flex items-center justify-between transition-colors"
              >
                <span className="font-medium">Priya Patel (4th Yr IT • Level 21)</span>
                <span className="text-[10px] text-purple-400 font-mono">High Rank &rarr;</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" onClick={() => sound.playClick()} className="text-cyan-400 hover:underline font-semibold">
              Create an initiate account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
