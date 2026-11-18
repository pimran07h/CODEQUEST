import { Router, Request, Response } from 'express';
import { db } from '../services/store.js';
import { WORLDS } from '../data/worlds.js';
import { QUIZ_QUESTIONS } from '../data/quizzes.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { executeCode } from '../services/codeExecution.js';
import { askAiTutor } from '../services/aiTutor.js';
import { Challenge, Language } from '../types.js';

const router = Router();

// ================= AUTHENTICATION =================
router.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  let user = db.getUserByEmail(email);
  if (!user) {
    // If not found, use demo user or create
    user = db.getUser('demo-user');
  }

  res.json({ success: true, user });
});

router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, college, year, branch, preferredLanguage, avatar } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.json({ success: true, user: existing });
  }

  const user = db.createUser({
    name,
    email,
    college: college || "National Institute of Technology",
    year: year || "2nd Year",
    branch: branch || "Computer Science",
    preferredLanguage: preferredLanguage || "javascript",
    avatar: avatar || "avatar-cyber-ninja"
  });

  res.status(201).json({ success: true, user });
});

router.get('/auth/me/:userId', (req: Request, res: Response) => {
  const user = db.getUser(req.params.userId) || db.getUser('demo-user');
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ success: true, user });
});

// Update user preferences / skin
router.patch('/auth/me/:userId', (req: Request, res: Response) => {
  const user = db.getUser(req.params.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { preferredLanguage, avatar, skin } = req.body;
  if (preferredLanguage) user.preferredLanguage = preferredLanguage;
  if (avatar) user.avatar = avatar;
  if (skin) user.skin = skin;

  res.json({ success: true, user });
});

// ================= WORLDS =================
router.get('/worlds', (req: Request, res: Response) => {
  // Return worlds without hidden test cases
  const sanitizedWorlds = WORLDS.map(w => ({
    ...w,
    challenges: w.challenges.map(c => ({
      ...c,
      testCases: c.testCases.filter(tc => !tc.isHidden)
    }))
  }));
  res.json({ success: true, worlds: sanitizedWorlds });
});

router.get('/worlds/:worldId', (req: Request, res: Response) => {
  const worldId = parseInt(req.params.worldId);
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return res.status(404).json({ error: "World not found" });

  const sanitized = {
    ...world,
    challenges: world.challenges.map(c => ({
      ...c,
      testCases: c.testCases.filter(tc => !tc.isHidden)
    }))
  };

  res.json({ success: true, world: sanitized });
});

// ================= CHALLENGES & CODING ARENA =================
router.get('/challenges/:id', (req: Request, res: Response) => {
  let challenge: Challenge | undefined;
  for (const w of WORLDS) {
    const c = w.challenges.find(ch => ch.id === req.params.id);
    if (c) { challenge = c; break; }
  }

  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  // Filter out hidden test cases for client display
  const clientChallenge = {
    ...challenge,
    testCases: challenge.testCases.filter(tc => !tc.isHidden)
  };

  res.json({ success: true, challenge: clientChallenge });
});

// Run Code (Runs ONLY against sample test cases)
router.post('/challenges/:id/run', (req: Request, res: Response) => {
  const { code, language } = req.body;
  let challenge: Challenge | undefined;
  for (const w of WORLDS) {
    const c = w.challenges.find(ch => ch.id === req.params.id);
    if (c) { challenge = c; break; }
  }

  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  const sampleCases = challenge.testCases.filter(tc => !tc.isHidden);
  const result = executeCode({
    code,
    language: language as Language,
    testCases: sampleCases
  });

  res.json({ success: true, result });
});

// Submit Solution (Runs against ALL test cases including hidden ones, awards XP/Coins)
router.post('/challenges/:id/submit', (req: Request, res: Response) => {
  const { code, language, userId } = req.body;
  let challenge: Challenge | undefined;
  for (const w of WORLDS) {
    const c = w.challenges.find(ch => ch.id === req.params.id);
    if (c) { challenge = c; break; }
  }

  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  // Execute against all test cases (including hidden server-side test cases)
  const result = executeCode({
    code,
    language: language as Language,
    testCases: challenge.testCases,
    isSubmission: true
  });

  if (result.allPassed && userId) {
    try {
      const completion = db.recordChallengeCompletion(userId, challenge.id);
      result.xpAwarded = completion.xp;
      result.coinsAwarded = completion.coins;
    } catch (e: any) {
      console.warn("Error awarding XP:", e.message);
    }
  }

  res.json({ success: true, result });
});

// ================= AI CODING TUTOR =================
router.post('/ai-tutor', async (req: Request, res: Response) => {
  try {
    const { code, language, problemTitle, errorMessage, testCaseFailure, userQuestion } = req.body;
    const feedback = await askAiTutor({
      code: code || '',
      language: language || 'javascript',
      problemTitle: problemTitle || 'Coding Mission',
      errorMessage,
      testCaseFailure,
      userQuestion
    });
    res.json({ success: true, tutor: feedback });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ================= QUIZZES =================
router.get('/quizzes', (req: Request, res: Response) => {
  // Strip correct answer index for fair quiz competition
  const questions = QUIZ_QUESTIONS.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    category: q.category,
    difficulty: q.difficulty,
    codeSnippet: q.codeSnippet
  }));
  res.json({ success: true, questions });
});

router.post('/quizzes/submit', (req: Request, res: Response) => {
  const { questionId, selectedOption, userId } = req.body;
  const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });

  const isCorrect = question.correctAnswer === selectedOption;
  let xpAwarded = 0;
  let coinsAwarded = 0;

  if (isCorrect && userId) {
    xpAwarded = 30;
    coinsAwarded = 15;
    try {
      db.awardXP(userId, xpAwarded, coinsAwarded);
    } catch {}
  }

  res.json({
    success: true,
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    xpAwarded,
    coinsAwarded
  });
});

// ================= LEADERBOARD =================
router.get('/leaderboard', (req: Request, res: Response) => {
  const college = req.query.college as string | undefined;
  const year = req.query.year as string | undefined;
  const leaderboard = db.getLeaderboard({ college, year });
  res.json({ success: true, leaderboard });
});

// ================= DAILY CHALLENGE =================
router.get('/daily', (req: Request, res: Response) => {
  const daily = db.dailyChallenge;
  const sanitized = {
    ...daily,
    challenge: {
      ...daily.challenge,
      testCases: daily.challenge.testCases.filter(tc => !tc.isHidden)
    }
  };
  res.json({ success: true, daily: sanitized });
});

// ================= ACHIEVEMENTS =================
router.get('/achievements', (req: Request, res: Response) => {
  res.json({ success: true, achievements: ACHIEVEMENTS });
});

router.post('/achievements/:id/claim', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = db.getUser(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const ach = ACHIEVEMENTS.find(a => a.id === req.params.id);
  if (!ach) return res.status(404).json({ error: "Achievement not found" });

  if (!user.achievements.includes(ach.id)) {
    user.achievements.push(ach.id);
    db.awardXP(userId, ach.xpReward, ach.coinReward);
  }

  res.json({ success: true, user });
});

// ================= ADMIN DASHBOARD =================
router.get('/admin/metrics', (req: Request, res: Response) => {
  const totalStudents = db.users.size;
  const totalCompletions = Array.from(db.users.values()).reduce((acc, u) => acc + u.completedChallenges.length, 0);
  const totalXP = Array.from(db.users.values()).reduce((acc, u) => acc + u.xp, 0);

  res.json({
    success: true,
    metrics: {
      totalStudents,
      activeStudentsOnline: Math.floor(totalStudents * 0.75) + 3,
      totalCompletions,
      totalXP,
      totalWorlds: WORLDS.length,
      totalChallenges: WORLDS.reduce((acc, w) => acc + w.challenges.length, 0),
      quizzesAnswered: 1420,
      matchesPlayedToday: 84
    }
  });
});

export default router;
