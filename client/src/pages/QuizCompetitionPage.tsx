import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import type { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Clock, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Zap, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const QuizCompetitionPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  // Lifelines
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  useEffect(() => {
    api.getQuizzes()
      .then(res => {
        if (res.success) setQuestions(res.questions);
      })
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameOver || isAnswered || loading) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, isAnswered, gameOver, loading]);

  const handleTimeOut = () => {
    sound.playError();
    setIsAnswered(true);
    setStreak(0);
  };

  const handleAnswer = async (optionIdx: number) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const q = questions[currentIdx];
    try {
      const res = await api.submitQuizAnswer(q.id, optionIdx, user?.id || 'demo-user');
      setEvalResult(res);

      if (res.isCorrect) {
        sound.playSuccess();
        setStreak(s => s + 1);
        const streakBonus = 1 + streak * 0.2;
        setScore(s => s + Math.round(100 * streakBonus));
        refreshUser();
      } else {
        sound.playError();
        setStreak(0);
      }
    } catch (err) {
      sound.playError();
    }
  };

  const nextQuestion = () => {
    sound.playClick();
    if (currentIdx + 1 >= questions.length || currentIdx >= 9) {
      setGameOver(true);
      sound.playLevelUp();
      confetti({ particleCount: 80 });
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setEvalResult(null);
    setTimeLeft(30);
    setHiddenOptions([]);
    setActiveHint(null);
  };

  const restartQuiz = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setEvalResult(null);
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameOver(false);
    setFiftyFiftyUsed(false);
    setHintUsed(false);
    setHiddenOptions([]);
    setActiveHint(null);
  };

  // Lifeline 1: 50/50
  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || isAnswered) return;
    sound.playClick();
    setFiftyFiftyUsed(true);
    // Randomly pick 2 non-correct choices to hide
    const toHide: number[] = [];
    while (toHide.length < 2) {
      const r = Math.floor(Math.random() * 4);
      // Ensure we don't hide candidate and avoid duplicates
      if (!toHide.includes(r) && r !== 0) {
        toHide.push(r);
      }
    }
    setHiddenOptions(toHide);
  };

  // Lifeline 2: Hint
  const useHintBeacon = () => {
    if (hintUsed || isAnswered) return;
    sound.playClick();
    setHintUsed(true);
    setActiveHint(`Turing's Clue: Focus on the time complexity guarantees and standard library specifications!`);
  };

  // Lifeline 3: Freeze Timer
  const useTimeFreeze = () => {
    sound.playClick();
    setTimeLeft(t => t + 20);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <p className="font-gaming text-cyan-300 animate-pulse">Loading Quiz Show Matrix...</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Header HUD */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b1020] border border-purple-900/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
            QUESTION {currentIdx + 1} OF {Math.min(questions.length, 10)}
          </span>
          <h2 className="text-base font-bold font-gaming text-white">Engineering Trivia Show</h2>
        </div>

        {/* Streak & Score */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 font-mono text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{streak}x Streak</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-yellow-950/60 border border-yellow-800 text-yellow-300 font-mono text-xs font-bold">
            <span>Score: {score}</span>
          </div>
        </div>
      </div>

      {!gameOver && currentQ ? (
        <div className="space-y-6">
          
          {/* Lifelines Bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold font-gaming">Available Lifelines:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={useFiftyFifty}
                disabled={fiftyFiftyUsed || isAnswered}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 font-mono font-bold"
              >
                50:50 {fiftyFiftyUsed ? '✓' : ''}
              </button>
              <button
                onClick={useHintBeacon}
                disabled={hintUsed || isAnswered}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-purple-300 font-mono font-bold"
              >
                💡 Hint {hintUsed ? '✓' : ''}
              </button>
              <button
                onClick={useTimeFreeze}
                disabled={isAnswered}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 font-mono font-bold"
              >
                ⏳ +20s
              </button>
            </div>
          </div>

          {/* Active Hint Banner */}
          {activeHint && (
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-600/60 text-purple-200 text-xs">
              {activeHint}
            </div>
          )}

          {/* Timer Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft > 10 ? 'bg-cyan-400' : 'bg-rose-500 animate-pulse'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1628] border border-purple-900/50 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {currentQ.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ⏱️ {timeLeft}s remaining
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-gaming text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="p-3.5 rounded-xl bg-[#070b14] border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* 4 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                if (hiddenOptions.includes(idx)) {
                  return (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-900 bg-black/20 opacity-20 text-xs font-mono">
                      [Eliminated by 50:50]
                    </div>
                  );
                }

                const isSelected = selectedOption === idx;
                const isCorrect = evalResult && evalResult.correctAnswer === idx;
                const isWrong = evalResult && !evalResult.isCorrect && isSelected;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-2.5 ${
                      isCorrect
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg'
                        : isWrong
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : isSelected
                        ? 'bg-purple-950 border-cyan-400 text-cyan-300'
                        : 'bg-[#090e1a] border-slate-800 text-slate-200 hover:border-purple-600 hover:bg-slate-850'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-md bg-black/40 border border-current inline-flex items-center justify-center shrink-0 text-[10px] font-mono">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {isAnswered && evalResult && (
              <div className="p-4 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  {evalResult.isCorrect ? (
                    <span className="text-emerald-400 font-bold font-gaming flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct Answer! (+{evalResult.xpAwarded} XP)
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold font-gaming flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Incorrect Answer!
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Explanation:</strong> {evalResult.explanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={nextQuestion}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-bold flex items-center gap-1 shadow-lg"
                  >
                    <span>NEXT QUESTION</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Quiz Over Screen */
        <div className="p-10 rounded-3xl bg-[#0e1628] border border-purple-600 text-center space-y-4 shadow-2xl">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-bold font-gaming text-white">Quiz Show Complete!</h3>
          <p className="text-sm text-slate-300">
            You scored <strong className="text-yellow-400 font-mono text-lg">{score} Points</strong> across the arena.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-semibold"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
