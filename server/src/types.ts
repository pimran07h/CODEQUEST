export type Language = 'javascript' | 'python' | 'c' | 'cpp' | 'java';

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  branch: string;
  avatar: string;
  skin: string;
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastLoginDate: string;
  preferredLanguage: Language;
  completedChallenges: string[];
  unlockedWorlds: number[];
  achievements: string[];
  battleStats: {
    matchesPlayed: number;
    victories: number;
    quizzesWon: number;
  };
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  isHidden?: boolean;
}

export interface Challenge {
  id: string;
  worldId: number;
  levelNumber: number;
  title: string;
  subtitle: string;
  description: string;
  storyContext: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Boss';
  xpReward: number;
  coinReward: number;
  topics: string[];
  starterCode: Record<Language, string>;
  solutionTemplates?: Record<Language, string>;
  testCases: TestCase[];
  hints: string[];
  isBoss?: boolean;
}

export interface World {
  id: number;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  topics: string[];
  themeColor: string;
  accentColor: string;
  iconName: string;
  bannerImage: string;
  bossName: string;
  bossTitle: string;
  bossAvatar: string;
  requiredLevel: number;
  xpCompletionReward: number;
  coinCompletionReward: number;
  challenges: Challenge[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  codeSnippet?: string;
  language?: Language;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Progression' | 'Combat' | 'Speed' | 'Mastery';
  xpReward: number;
  coinReward: number;
  requirement: {
    type: 'xp' | 'challenges' | 'streak' | 'battles' | 'world' | 'quiz';
    target: number;
  };
}

export interface DailyChallenge {
  id: string;
  date: string;
  challenge: Challenge;
  bonusMultiplier: number;
  expiresInSeconds: number;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryUsedMb: number;
  testsPassed: number;
  totalTests: number;
  testDetails: {
    caseId: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
    description: string;
    isHidden: boolean;
  }[];
  allPassed: boolean;
  xpAwarded?: number;
  coinsAwarded?: number;
}

export interface AITutorResponse {
  analysis: string;
  hint: string;
  lineExplanation: string;
  conceptGuidance: string;
  complexityTip: string;
}
