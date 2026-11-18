import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import type { Language } from '../types';
import { Code2, User, Mail, School, BookOpen, Sparkles, ArrowRight, Check } from 'lucide-react';

const AVATARS = [
  { id: 'avatar-cyber-ninja', name: 'Cyber Ninja', icon: '🥷', desc: 'Fast syntax reflexes & stealth debugging' },
  { id: 'avatar-arcane-sorceress', name: 'Arcane Sorceress', icon: '🧙‍♀️', desc: 'Masters modular spells & recursive magic' },
  { id: 'avatar-mecha-knight', name: 'Mecha Knight', icon: '🤖', desc: 'Heavy armor built on robust OOP hierarchies' },
  { id: 'avatar-cyber-hacker', name: 'System Infiltrator', icon: '👾', desc: 'Algorithmic exploits & bitwise trickery' }
];

const LANGUAGES: { id: Language; name: string; tag: string }[] = [
  { id: 'javascript', name: 'JavaScript', tag: 'Web & Async' },
  { id: 'python', name: 'Python', tag: 'AI & Clean Syntax' },
  { id: 'cpp', name: 'C++', tag: 'High Performance & STL' },
  { id: 'c', name: 'C', tag: 'Core Pointers & Systems' },
  { id: 'java', name: 'Java', tag: 'Strict OOP & Enterprise' }
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('IIT Bombay');
  const [year, setYear] = useState<'1st Year' | '2nd Year' | '3rd Year' | '4th Year'>('2nd Year');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('python');
  const [avatar, setAvatar] = useState('avatar-cyber-ninja');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in your name and email.');
      sound.playError();
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({
        name,
        email,
        college,
        year,
        branch,
        preferredLanguage,
        avatar
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      sound.playError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-16 px-4 sm:px-6 lg:px-8 hud-grid-bg flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" onClick={() => sound.playClick()} className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#080d1a] rounded-[6px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-gaming text-2xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              CODEQUEST
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-gaming text-white">Initiate Student Registration</h2>
          <p className="text-xs text-slate-400 mt-1">Configure your avatar, engineering cohort, and weapon of choice.</p>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-2xl bg-[#0e1628]/90 border border-purple-900/40 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-950/70 border border-rose-700 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Personal info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: College & Cohort */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  College / Institute
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="IIT Bombay, BITS, NIT..."
                  className="w-full px-3.5 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  B.Tech Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="1st Year">1st Year (Fresher)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior / Placement)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Engineering Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#080c16] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                  <option value="Information Technology">Information Tech (IT)</option>
                  <option value="Artificial Intelligence & DS">AI & Data Science</option>
                  <option value="Electronics & Communication">Electronics (ECE)</option>
                  <option value="Electrical Engineering">Electrical (EE)</option>
                  <option value="Mechanical / Other">Mechanical / Other</option>
                </select>
              </div>
            </div>

            {/* Step 3: Choose Avatar */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Select Your Cyber Avatar
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setAvatar(av.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      avatar === av.id
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-neon-cyan'
                        : 'border-slate-800 bg-[#080c16] hover:border-slate-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{av.icon}</div>
                    <div className="font-semibold text-xs text-white">{av.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{av.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Preferred Weapon (Programming Language) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Preferred Primary Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPreferredLanguage(lang.id);
                    }}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      preferredLanguage === lang.id
                        ? 'border-purple-400 bg-purple-950/60 shadow-neon-purple text-cyan-300 font-bold'
                        : 'border-slate-800 bg-[#080c16] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono">{lang.name}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{lang.tag}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-gaming font-bold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
            >
              {loading ? 'Initializing Character...' : 'Create Account & Start Journey'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" onClick={() => sound.playClick()} className="text-cyan-400 hover:underline font-semibold">
              Login to terminal
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
