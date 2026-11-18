import { Achievement } from '../types.js';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-code",
    title: "First Code",
    description: "Write, test, and pass your very first coding mission.",
    icon: "Code2",
    category: "Progression",
    xpReward: 100,
    coinReward: 50,
    requirement: { type: "challenges", target: 1 }
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    description: "Successfully debug and overcome tricky test cases in the arena.",
    icon: "Bug",
    category: "Mastery",
    xpReward: 150,
    coinReward: 75,
    requirement: { type: "challenges", target: 5 }
  },
  {
    id: "logic-master",
    title: "Logic Master",
    description: "Defeat the Infinite Loop Beast and conquer the Logic Dungeon.",
    icon: "Cpu",
    category: "Progression",
    xpReward: 250,
    coinReward: 150,
    requirement: { type: "world", target: 2 }
  },
  {
    id: "speed-coder",
    title: "Speed Coder",
    description: "Complete a coding challenge in under 60 seconds.",
    icon: "Zap",
    category: "Speed",
    xpReward: 200,
    coinReward: 100,
    requirement: { type: "challenges", target: 3 }
  },
  {
    id: "world-explorer",
    title: "World Explorer",
    description: "Unlock and explore at least 3 distinct coding realms.",
    icon: "Compass",
    category: "Progression",
    xpReward: 300,
    coinReward: 200,
    requirement: { type: "world", target: 3 }
  },
  {
    id: "code-champion",
    title: "Code Champion",
    description: "Defeat all 6 boss titans and claim supreme mastery.",
    icon: "Crown",
    category: "Mastery",
    xpReward: 1000,
    coinReward: 1000,
    requirement: { type: "world", target: 6 }
  },
  {
    id: "daily-warrior",
    title: "Streak Legend",
    description: "Maintain an unbroken daily coding streak for 3 days.",
    icon: "Flame",
    category: "Progression",
    xpReward: 200,
    coinReward: 100,
    requirement: { type: "streak", target: 3 }
  },
  {
    id: "arena-gladiator",
    title: "Multiplayer Gladiator",
    description: "Emerge victorious in a 1v1 live multiplayer coding duel.",
    icon: "Swords",
    category: "Combat",
    xpReward: 250,
    coinReward: 150,
    requirement: { type: "battles", target: 1 }
  },
  {
    id: "quiz-royale",
    title: "Quiz Titan",
    description: "Achieve 1st place in a live multi-player quiz competition.",
    icon: "Trophy",
    category: "Combat",
    xpReward: 200,
    coinReward: 120,
    requirement: { type: "quiz", target: 1 }
  }
];
