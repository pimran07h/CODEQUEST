import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Language } from '../types';
import { api } from '../services/api';
import { sound } from '../utils/audio';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isMuted: boolean;
  toggleSound: () => void;
  login: (email: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updatePreferences: (data: { preferredLanguage?: Language; avatar?: string; skin?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  useEffect(() => {
    const savedUserId = localStorage.getItem('codequest_user_id') || 'demo-user';
    api.getMe(savedUserId)
      .then(res => {
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('codequest_user_id', res.user.id);
        }
      })
      .catch(err => {
        console.warn("Could not fetch remote user, initializing local demo user:", err.message);
        // Fallback demo user
        const demo: User = {
          id: 'demo-user',
          name: 'Alex Vance (Initiate)',
          email: 'student@codequest.dev',
          college: 'Indian Institute of Technology',
          year: '2nd Year',
          branch: 'Computer Science',
          avatar: 'avatar-cyber-ninja',
          skin: 'neon-cyan',
          xp: 1850,
          level: 6,
          coins: 950,
          streakDays: 5,
          lastLoginDate: new Date().toISOString(),
          preferredLanguage: 'javascript',
          completedChallenges: ['w1-l1', 'w1-l2', 'w1-l3'],
          unlockedWorlds: [1, 2, 3],
          achievements: ['first-code', 'speed-coder'],
          battleStats: { matchesPlayed: 8, victories: 5, quizzesWon: 4 }
        };
        setUser(demo);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const login = async (email: string) => {
    sound.playClick();
    const res = await api.login(email);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('codequest_user_id', res.user.id);
      sound.playSuccess();
    }
  };

  const register = async (data: Partial<User>) => {
    sound.playClick();
    const res = await api.register(data);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('codequest_user_id', res.user.id);
      sound.playLevelUp();
    }
  };

  const logout = () => {
    sound.playClick();
    localStorage.removeItem('codequest_user_id');
    // Set to demo initiate
    login('student@codequest.dev');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await api.getMe(user.id);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {}
  };

  const updatePreferences = async (data: { preferredLanguage?: Language; avatar?: string; skin?: string }) => {
    if (!user) return;
    sound.playClick();
    try {
      const res = await api.updatePreferences(user.id, data);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      // Local optimistic update
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isMuted,
      toggleSound,
      login,
      register,
      logout,
      refreshUser,
      updatePreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
