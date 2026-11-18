import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { sound } from '../utils/audio';
import type { Challenge, Language, ExecutionResult, AITutorResponse } from '../types';
import { 
  Play, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  HelpCircle, 
  Bot, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft,
  Clock,
  HardDrive,
  Lightbulb,
  BookOpen
} from 'lucide-react';

export const CodingArenaPage: React.FC = () => {
  const { challengeId } = useParams();
  const { user, refreshUser } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(user?.preferredLanguage || 'javascript');
  const [code, setCode] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'tests' | 'console' | 'hints'>('tests');
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);

  // AI Tutor state
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AITutorResponse | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');

  // Load challenge
  useEffect(() => {
    const targetId = challengeId || 'w1-l1';
    api.getChallenge(targetId)
      .then(res => {
        if (res.success && res.challenge) {
          setChallenge(res.challenge);
          const lang = user?.preferredLanguage || 'javascript';
          setSelectedLanguage(lang);
          setCode(res.challenge.starterCode[lang] || res.challenge.starterCode.javascript);
        }
      })
      .catch(console.warn);
  }, [challengeId, user?.preferredLanguage]);

  // Language switch
  const handleLanguageChange = (newLang: Language) => {
    sound.playClick();
    setSelectedLanguage(newLang);
    if (challenge?.starterCode[newLang]) {
      setCode(challenge.starterCode[newLang]);
    }
    setResult(null);
  };

  // Reset starter code
  const handleResetCode = () => {
    sound.playClick();
    if (challenge?.starterCode[selectedLanguage]) {
      setCode(challenge.starterCode[selectedLanguage]);
    }
    setResult(null);
  };

  // Run code against sample tests
  const handleRunCode = async () => {
    if (!challenge) return;
    sound.playClick();
    setRunning(true);
    setResult(null);
    try {
      const res = await api.runCode(challenge.id, code, selectedLanguage);
      if (res.success) {
        setResult(res.result);
        if (res.result.allPassed) {
          sound.playSuccess();
        } else {
          sound.playError();
        }
      }
    } catch (err: any) {
      sound.playError();
      setResult({
        success: false,
        stdout: '',
        stderr: err.message,
        executionTimeMs: 0,
        memoryUsedMb: 0,
        testsPassed: 0,
        totalTests: challenge.testCases.length,
        testDetails: [],
        allPassed: false
      });
    } finally {
      setRunning(false);
    }
  };

  // Submit solution (evaluates hidden tests & gives rewards)
  const handleSubmitCode = async () => {
    if (!challenge) return;
    sound.playClick();
    setSubmitting(true);
    try {
      const res = await api.submitCode(challenge.id, code, selectedLanguage, user?.id || 'demo-user');
      if (res.success) {
        setResult(res.result);
        if (res.result.allPassed) {
          sound.playLevelUp();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
          refreshUser();
        } else {
          sound.playError();
        }
      }
    } catch (err: any) {
      sound.playError();
    } finally {
      setSubmitting(false);
    }
  };

  // Ask AI Tutor
  const handleAskTutor = async (questionOverride?: string) => {
    if (!challenge) return;
    sound.playClick();
    setAiLoading(true);
    setAiPanelOpen(true);
    try {
      const failureNotice = result && !result.allPassed
        ? result.stderr || (result.testDetails.find(t => !t.passed) ? `Output mismatch: actual '${result.testDetails.find(t => !t.passed)?.actualOutput}' vs expected '${result.testDetails.find(t => !t.passed)?.expectedOutput}'` : '')
        : undefined;

      const res = await api.askAiTutor({
        code,
        language: selectedLanguage,
        problemTitle: challenge.title,
        errorMessage: result?.stderr,
        testCaseFailure: failureNotice,
        userQuestion: questionOverride || customQuestion
      });

      if (res.success) {
        setAiFeedback(res.tutor);
        sound.playSuccess();
      }
    } catch (err) {
      sound.playError();
    } finally {
      setAiLoading(false);
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center">
        <p className="font-gaming text-cyan-300 animate-pulse">Loading Arena Chamber...</p>
      </div>
    );
  }

  // Monaco Language mapping
  const monacoLang = selectedLanguage === 'cpp' || selectedLanguage === 'c' ? 'cpp' : selectedLanguage;

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col h-screen overflow-hidden">
      
      {/* Top IDE Toolbar */}
      <div className="h-14 bg-[#090e1c] border-b border-purple-900/40 px-4 flex items-center justify-between shrink-0">
        
        {/* Left: Challenge info & navigation */}
        <div className="flex items-center gap-3">
          <Link
            to="/worlds"
            onClick={() => sound.playClick()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              challenge.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-300' :
              challenge.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
            }`}>
              {challenge.difficulty}
            </span>
            <span className="text-sm font-bold font-gaming text-white truncate max-w-xs sm:max-w-md">
              {challenge.title}
            </span>
          </div>
        </div>

        {/* Center: Language selector */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-400 font-mono hidden sm:inline">Weapon:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="px-2.5 py-1 rounded-lg bg-[#0d1424] border border-purple-800 text-cyan-300 text-xs font-mono font-semibold focus:outline-none focus:border-cyan-400"
          >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (G++ 20)</option>
            <option value="c">C (GCC)</option>
            <option value="java">Java 21</option>
          </select>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Tutor Toggle Button */}
          <button
            onClick={() => {
              setAiPanelOpen(!aiPanelOpen);
              if (!aiFeedback && !aiPanelOpen) handleAskTutor();
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-gaming font-semibold flex items-center gap-1.5 transition-all ${
              aiPanelOpen 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400 shadow-neon-cyan' 
                : 'bg-slate-800/80 border-slate-700 text-purple-300 hover:border-purple-500'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* Reset Code */}
          <button
            onClick={handleResetCode}
            title="Reset Starter Code"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Run Code */}
          <button
            onClick={handleRunCode}
            disabled={running || submitting}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-gaming text-xs font-semibold flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>{running ? 'Running...' : 'Run'}</span>
          </button>

          {/* Submit Solution */}
          <button
            onClick={handleSubmitCode}
            disabled={running || submitting}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/50 hover:opacity-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>

      </div>

      {/* Main IDE Workspace (Split Screen) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Problem Statement & Lore */}
        <div className="w-1/3 min-w-[280px] max-w-md bg-[#090d18] border-r border-purple-900/30 p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Story Lore Box */}
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 font-mono block mb-1">
                Lore Context
              </span>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{challenge.storyContext}"
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-gaming mb-1.5">
                Mission Objective
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Topics */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-gaming mb-1.5">
                Target Concepts
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {challenge.topics.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Test Cases Preview */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-gaming mb-2">
                Sample Test Scenarios
              </h4>
              <div className="space-y-2">
                {challenge.testCases.map((tc, idx) => (
                  <div key={tc.id} className="p-2.5 rounded-lg bg-[#060a14] border border-slate-800 text-xs font-mono">
                    <div className="text-[10px] text-slate-500 mb-1">{tc.description}</div>
                    <div className="text-slate-300"><span className="text-purple-400">Input:</span> {tc.input || 'None'}</div>
                    <div className="text-cyan-300"><span className="text-purple-400">Expected:</span> {tc.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Built-in Hints Accordion */}
            {challenge.hints?.length > 0 && (
              <div className="p-3 rounded-xl bg-[#0d1424] border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 font-gaming flex items-center gap-1 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Quest Clues ({challenge.hints.length})
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {challenge.hints.map((hint, i) => (
                    <li key={i}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>+{challenge.xpReward} XP</span>
            <span>+{challenge.coinReward} Coins</span>
          </div>
        </div>

        {/* Center: Monaco Editor & Bottom Result Drawer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Monaco Editor Canvas */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={monacoLang}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"Fira Code", Consolas, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Bottom Drawer: Test Case Results & Console */}
          <div className="h-56 bg-[#090d18] border-t border-purple-900/40 flex flex-col shrink-0">
            
            {/* Drawer Tabs Header */}
            <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-3 py-1 rounded-md font-gaming font-semibold flex items-center gap-1.5 ${
                    activeTab === 'tests' ? 'bg-purple-950 text-cyan-300 border border-purple-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Test Results</span>
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`px-3 py-1 rounded-md font-gaming font-semibold flex items-center gap-1.5 ${
                    activeTab === 'console' ? 'bg-purple-950 text-cyan-300 border border-purple-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console Log</span>
                </button>
              </div>

              {/* Execution Stats Badge */}
              {result && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-cyan-400" /> {result.executionTimeMs}ms
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <HardDrive className="w-3 h-3 text-purple-400" /> {result.memoryUsedMb}MB
                  </span>
                  <span className={`font-bold ${result.allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.testsPassed}/{result.totalTests} Passed
                  </span>
                </div>
              )}
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {activeTab === 'tests' && (
                <div>
                  {result ? (
                    <div className="space-y-3">
                      {/* Reward celebration banner */}
                      {result.allPassed && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 flex items-center justify-between">
                          <span>🎉 Perfect Execution! All test cases cleared.</span>
                          {result.xpAwarded ? (
                            <span className="font-bold text-yellow-300">
                              +{result.xpAwarded} XP & +{result.coinsAwarded} Coins Added to Profile!
                            </span>
                          ) : null}
                        </div>
                      )}

                      {/* Test case tabs */}
                      <div className="flex gap-2">
                        {result.testDetails.map((td, idx) => (
                          <button
                            key={td.caseId}
                            onClick={() => setSelectedTestCaseIdx(idx)}
                            className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                              selectedTestCaseIdx === idx
                                ? 'bg-[#0f1930] border-cyan-400 text-cyan-300'
                                : 'bg-[#070b14] border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {td.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span>Case {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {/* Selected test details */}
                      {result.testDetails[selectedTestCaseIdx] && (
                        <div className="p-3 rounded-xl bg-[#060a14] border border-slate-800/80 space-y-1.5">
                          <p className="text-slate-400 text-[11px]">
                            {result.testDetails[selectedTestCaseIdx].description}
                          </p>
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-purple-400 text-[10px] uppercase">Actual Output:</span>
                              <pre className="mt-0.5 p-2 rounded bg-black/50 text-slate-200">
                                {result.testDetails[selectedTestCaseIdx].actualOutput}
                              </pre>
                            </div>
                            <div>
                              <span className="text-purple-400 text-[10px] uppercase">Expected Output:</span>
                              <pre className="mt-0.5 p-2 rounded bg-black/50 text-cyan-300">
                                {result.testDetails[selectedTestCaseIdx].expectedOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {result.stderr && (
                        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                          <strong className="block mb-1">Execution / Compilation Error:</strong>
                          <pre>{result.stderr}</pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                      Press "Run" to test your solution against sample inputs, or "Submit" to evaluate all hidden verification cases.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'console' && (
                <div>
                  {result?.stdout ? (
                    <pre className="text-slate-300 leading-relaxed">{result.stdout}</pre>
                  ) : (
                    <p className="text-slate-500">No standard output recorded. Use console.log / print() in your code.</p>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Collapsible Socratic AI Coding Tutor Panel */}
        {aiPanelOpen && (
          <div className="w-80 bg-[#0c1326] border-l border-cyan-800/40 p-5 overflow-y-auto space-y-4 flex flex-col justify-between shrink-0 shadow-2xl">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-gaming text-white">Professor Turing</h3>
                    <p className="text-[10px] text-cyan-400 font-mono">Socratic AI Mentor</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="text-slate-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {aiLoading ? (
                <div className="py-12 text-center space-y-2">
                  <Bot className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs font-gaming text-cyan-300">Analyzing syntax & logic traces...</p>
                </div>
              ) : aiFeedback ? (
                <div className="space-y-3.5 text-xs">
                  
                  {/* Diagnosis */}
                  <div className="p-3 rounded-xl bg-[#070b14] border border-cyan-900/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                      Code Diagnosis
                    </span>
                    <p className="text-slate-300 leading-relaxed">{aiFeedback.analysis}</p>
                  </div>

                  {/* Socratic Hint */}
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Pedagogical Clue
                    </span>
                    <p className="text-slate-200 leading-relaxed">{aiFeedback.hint}</p>
                  </div>

                  {/* Line Explanation */}
                  <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Line Execution Trace
                    </span>
                    <p className="text-slate-300 leading-relaxed">{aiFeedback.lineExplanation}</p>
                  </div>

                  {/* Complexity */}
                  <div className="p-3 rounded-xl bg-[#070b14] border border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      Big-O Efficiency Tip
                    </span>
                    <p className="text-slate-300">{aiFeedback.complexityTip}</p>
                  </div>

                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <Lightbulb className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs">Stuck on an error or looking to optimize your Big-O?</p>
                  <button
                    onClick={() => handleAskTutor()}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-gaming text-xs font-semibold"
                  >
                    Diagnose My Code
                  </button>
                </div>
              )}

            </div>

            {/* Custom Question Form */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Ask Turing a question..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#070b14] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customQuestion) {
                      handleAskTutor(customQuestion);
                      setCustomQuestion('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customQuestion) {
                      handleAskTutor(customQuestion);
                      setCustomQuestion('');
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold"
                >
                  Ask
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
