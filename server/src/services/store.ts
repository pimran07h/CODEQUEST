import { User, Language, Challenge, DailyChallenge } from '../types.js';
import { WORLDS } from '../data/worlds.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

class DataStore {
  public users: Map<string, User> = new Map();
  public dailyChallenge: DailyChallenge;
  public battleHistory: any[] = [];

  constructor() {
    this.initializeSeedUsers();
    this.dailyChallenge = this.generateDailyChallenge();
  }

  private initializeSeedUsers() {
    const demoStudents: User[] = [
      {
        id: "student-1",
        name: "Arjun Sharma",
        email: "arjun@codequest.dev",
        college: "IIT Bombay",
        year: "3rd Year",
        branch: "Computer Science & Engineering",
        avatar: "avatar-cyber-ninja",
        skin: "neon-cyan",
        xp: 4250,
        level: 14,
        coins: 1850,
        streakDays: 12,
        lastLoginDate: new Date().toISOString(),
        preferredLanguage: "cpp",
        completedChallenges: ["w1-l1", "w1-l2", "w1-l3", "w1-l4", "w1-l5", "w2-l1", "w2-l2", "w2-l3", "w2-l4", "w2-l5", "w3-l1", "w3-l2"],
        unlockedWorlds: [1, 2, 3, 4],
        achievements: ["first-code", "bug-hunter", "logic-master", "daily-warrior", "arena-gladiator"],
        battleStats: { matchesPlayed: 28, victories: 22, quizzesWon: 15 }
      },
      {
        id: "student-2",
        name: "Priya Patel",
        email: "priya@codequest.dev",
        college: "BITS Pilani",
        year: "4th Year",
        branch: "Information Technology",
        avatar: "avatar-arcane-sorceress",
        skin: "arcane-purple",
        xp: 6800,
        level: 21,
        coins: 3400,
        streakDays: 24,
        lastLoginDate: new Date().toISOString(),
        preferredLanguage: "python",
        completedChallenges: ["w1-l1", "w1-l2", "w1-l3", "w1-l4", "w1-l5", "w2-l1", "w2-l2", "w2-l3", "w2-l4", "w2-l5", "w3-l1", "w3-l2", "w3-l3", "w3-l4", "w3-l5", "w4-l1", "w4-l2"],
        unlockedWorlds: [1, 2, 3, 4, 5],
        achievements: ["first-code", "bug-hunter", "logic-master", "world-explorer", "speed-coder", "daily-warrior", "quiz-royale"],
        battleStats: { matchesPlayed: 45, victories: 36, quizzesWon: 29 }
      },
      {
        id: "student-3",
        name: "Rohan Gupta",
        email: "rohan@codequest.dev",
        college: "NIT Trichy",
        year: "2nd Year",
        branch: "Artificial Intelligence & Data Science",
        avatar: "avatar-mecha-knight",
        skin: "emerald-glow",
        xp: 2950,
        level: 9,
        coins: 1100,
        streakDays: 7,
        lastLoginDate: new Date().toISOString(),
        preferredLanguage: "java",
        completedChallenges: ["w1-l1", "w1-l2", "w1-l3", "w1-l4", "w1-l5", "w2-l1", "w2-l2"],
        unlockedWorlds: [1, 2, 3],
        achievements: ["first-code", "logic-master"],
        battleStats: { matchesPlayed: 14, victories: 9, quizzesWon: 6 }
      },
      {
        id: "student-4",
        name: "Ananya Sen",
        email: "ananya@codequest.dev",
        college: "DTU Delhi",
        year: "1st Year",
        branch: "Electronics & Communication",
        avatar: "avatar-cyber-hacker",
        skin: "solar-amber",
        xp: 1250,
        level: 4,
        coins: 600,
        streakDays: 3,
        lastLoginDate: new Date().toISOString(),
        preferredLanguage: "javascript",
        completedChallenges: ["w1-l1", "w1-l2", "w1-l3"],
        unlockedWorlds: [1, 2],
        achievements: ["first-code"],
        battleStats: { matchesPlayed: 6, victories: 3, quizzesWon: 4 }
      },
      {
        id: "demo-user",
        name: "Alex Vance (You)",
        email: "student@codequest.dev",
        college: "Indian Institute of Technology",
        year: "2nd Year",
        branch: "Computer Science",
        avatar: "avatar-cyber-ninja",
        skin: "neon-cyan",
        xp: 1850,
        level: 6,
        coins: 950,
        streakDays: 5,
        lastLoginDate: new Date().toISOString(),
        preferredLanguage: "javascript",
        completedChallenges: ["w1-l1", "w1-l2", "w1-l3"],
        unlockedWorlds: [1, 2, 3],
        achievements: ["first-code", "speed-coder"],
        battleStats: { matchesPlayed: 8, victories: 5, quizzesWon: 4 }
      }
    ];

    demoStudents.forEach(u => this.users.set(u.id, u));
  }

  public generateDailyChallenge(): DailyChallenge {
    // Pick challenge w2-l3 or w1-l4
    const today = new Date().toISOString().split('T')[0];
    const pickedChallenge = WORLDS[1].challenges[2]; // Prime Crypt

    return {
      id: `daily-${today}`,
      date: today,
      challenge: pickedChallenge,
      bonusMultiplier: 1.5,
      expiresInSeconds: 86400 - (Math.floor(Date.now() / 1000) % 86400)
    };
  }

  public getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return undefined;
  }

  public createUser(userData: Partial<User>): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newUser: User = {
      id,
      name: userData.name || "Coder Initiate",
      email: userData.email || `${id}@codequest.dev`,
      college: userData.college || "B.Tech Institute",
      year: userData.year || "1st Year",
      branch: userData.branch || "Computer Science",
      avatar: userData.avatar || "avatar-cyber-ninja",
      skin: userData.skin || "neon-cyan",
      xp: 0,
      level: 1,
      coins: 100,
      streakDays: 1,
      lastLoginDate: new Date().toISOString(),
      preferredLanguage: userData.preferredLanguage || "javascript",
      completedChallenges: [],
      unlockedWorlds: [1],
      achievements: [],
      battleStats: { matchesPlayed: 0, victories: 0, quizzesWon: 0 }
    };
    this.users.set(id, newUser);
    return newUser;
  }

  public awardXP(userId: string, xpEarned: number, coinsEarned: number): { user: User; leveledUp: boolean } {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    user.xp += xpEarned;
    user.coins += coinsEarned;

    // Calculate level: Level = Math.floor(Math.sqrt(XP / 25)) + 1
    const newLevel = Math.max(1, Math.floor(Math.sqrt(user.xp / 25)) + 1);
    const leveledUp = newLevel > user.level;
    user.level = newLevel;

    // Check unlocking worlds based on level
    WORLDS.forEach(w => {
      if (user.level >= w.requiredLevel && !user.unlockedWorlds.includes(w.id)) {
        user.unlockedWorlds.push(w.id);
      }
    });

    this.users.set(userId, user);
    return { user, leveledUp };
  }

  public recordChallengeCompletion(userId: string, challengeId: string): { user: User; xp: number; coins: number } {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    // Find challenge
    let challenge: Challenge | undefined;
    for (const w of WORLDS) {
      const found = w.challenges.find(c => c.id === challengeId);
      if (found) { challenge = found; break; }
    }

    if (!challenge) throw new Error("Challenge not found");

    const isFirstTime = !user.completedChallenges.includes(challengeId);
    if (isFirstTime) {
      user.completedChallenges.push(challengeId);
      // Give rewards
      const { user: updatedUser } = this.awardXP(userId, challenge.xpReward, challenge.coinReward);

      // Check achievements
      if (updatedUser.completedChallenges.length >= 1 && !updatedUser.achievements.includes('first-code')) {
        updatedUser.achievements.push('first-code');
      }
      if (updatedUser.completedChallenges.length >= 5 && !updatedUser.achievements.includes('bug-hunter')) {
        updatedUser.achievements.push('bug-hunter');
      }

      return { user: updatedUser, xp: challenge.xpReward, coins: challenge.coinReward };
    }

    return { user, xp: 0, coins: 0 };
  }

  public getLeaderboard(filter: { college?: string; year?: string } = {}): User[] {
    let list = Array.from(this.users.values());
    if (filter.college) {
      list = list.filter(u => u.college.toLowerCase().includes(filter.college!.toLowerCase()));
    }
    if (filter.year) {
      list = list.filter(u => u.year === filter.year);
    }
    return list.sort((a, b) => b.xp - a.xp);
  }
}

export const db = new DataStore();
