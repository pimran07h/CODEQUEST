import type { World, Challenge, User, QuizQuestion, Achievement, DailyChallenge, ExecutionResult, AITutorResponse, Language } from '../types';

const API_BASE = 'http://localhost:4000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: async (email: string) => {
    return fetchJson<{ success: boolean; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  register: async (data: Partial<User>) => {
    return fetchJson<{ success: boolean; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getMe: async (userId: string) => {
    return fetchJson<{ success: boolean; user: User }>(`/auth/me/${userId}`);
  },

  updatePreferences: async (userId: string, data: { preferredLanguage?: Language; avatar?: string; skin?: string }) => {
    return fetchJson<{ success: boolean; user: User }>(`/auth/me/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Worlds
  getWorlds: async () => {
    return fetchJson<{ success: boolean; worlds: World[] }>('/worlds');
  },

  getWorld: async (worldId: number) => {
    return fetchJson<{ success: boolean; world: World }>(`/worlds/${worldId}`);
  },

  // Challenges
  getChallenge: async (id: string) => {
    return fetchJson<{ success: boolean; challenge: Challenge }>(`/challenges/${id}`);
  },

  runCode: async (id: string, code: string, language: Language) => {
    return fetchJson<{ success: boolean; result: ExecutionResult }>(`/challenges/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ code, language })
    });
  },

  submitCode: async (id: string, code: string, language: Language, userId: string) => {
    return fetchJson<{ success: boolean; result: ExecutionResult }>(`/challenges/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code, language, userId })
    });
  },

  // AI Tutor
  askAiTutor: async (payload: {
    code: string;
    language: Language;
    problemTitle: string;
    errorMessage?: string;
    testCaseFailure?: string;
    userQuestion?: string;
  }) => {
    return fetchJson<{ success: boolean; tutor: AITutorResponse }>('/ai-tutor', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Quizzes
  getQuizzes: async () => {
    return fetchJson<{ success: boolean; questions: QuizQuestion[] }>('/quizzes');
  },

  submitQuizAnswer: async (questionId: string, selectedOption: number, userId: string) => {
    return fetchJson<{
      success: boolean;
      isCorrect: boolean;
      correctAnswer: number;
      explanation: string;
      xpAwarded: number;
      coinsAwarded: number;
    }>('/quizzes/submit', {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedOption, userId })
    });
  },

  // Leaderboard
  getLeaderboard: async (filters?: { college?: string; year?: string }) => {
    const params = new URLSearchParams();
    if (filters?.college) params.set('college', filters.college);
    if (filters?.year) params.set('year', filters.year);
    return fetchJson<{ success: boolean; leaderboard: User[] }>(`/leaderboard?${params.toString()}`);
  },

  // Daily Challenge
  getDaily: async () => {
    return fetchJson<{ success: boolean; daily: DailyChallenge }>('/daily');
  },

  // Achievements
  getAchievements: async () => {
    return fetchJson<{ success: boolean; achievements: Achievement[] }>('/achievements');
  },

  claimAchievement: async (achievementId: string, userId: string) => {
    return fetchJson<{ success: boolean; user: User }>(`/achievements/${achievementId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  },

  // Admin
  getAdminMetrics: async () => {
    return fetchJson<{
      success: boolean;
      metrics: {
        totalStudents: number;
        activeStudentsOnline: number;
        totalCompletions: number;
        totalXP: number;
        totalWorlds: number;
        totalChallenges: number;
        quizzesAnswered: number;
        matchesPlayedToday: number;
      };
    }>('/admin/metrics');
  }
};
