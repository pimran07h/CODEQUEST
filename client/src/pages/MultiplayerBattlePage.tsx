import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Users, 
  Clock, 
  Trophy, 
  Play, 
  Send, 
  Copy, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  Code2, 
  Zap,
  ArrowRight
} from 'lucide-react';
import Editor from '@monaco-editor/react';

export const MultiplayerBattlePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const socket = getSocket();

  const [mode, setMode] = useState<'duel' | 'quiz_royale'>('duel');
  const [matchState, setMatchState] = useState<'idle' | 'searching' | 'in_room' | 'battling' | 'finished'>('idle');

  // 1v1 Duel State
  const [roomId, setRoomId] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [duelChallenge, setDuelChallenge] = useState<any>(null);
  const [duelPlayers, setDuelPlayers] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [myCode, setMyCode] = useState('');
  const [duelWinner, setDuelWinner] = useState<any>(null);
  const [finishReason, setFinishReason] = useState('');
  const [copied, setCopied] = useState(false);

  // 4-Player Quiz Royale State
  const [quizLobby, setQuizLobby] = useState<any>(null);
  const [quizQuestion, setQuizQuestion] = useState<any>(null);
  const [quizRound, setQuizRound] = useState(1);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState(15);
  const [quizScores, setQuizScores] = useState<any[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizPodium, setQuizPodium] = useState<any[] | null>(null);

  // Socket event subscriptions
  useEffect(() => {
    // 1v1 events
    socket.on('duel:queued', () => {
      setMatchState('searching');
    });

    socket.on('duel:room_created', (data: { roomId: string; room: any }) => {
      setRoomId(data.roomId);
      setMatchState('in_room');
      setDuelPlayers(data.room.players);
    });

    socket.on('duel:matched', (data: { roomId: string; challenge: any; timeRemaining: number; players: any[] }) => {
      sound.playLevelUp();
      setRoomId(data.roomId);
      setDuelChallenge(data.challenge);
      setDuelPlayers(data.players);
      setTimeRemaining(data.timeRemaining);
      setMyCode(data.challenge.starterCode[user?.preferredLanguage || 'javascript'] || data.challenge.starterCode.javascript);
      setMatchState('battling');
    });

    socket.on('duel:timer_tick', (data: { timeRemaining: number }) => {
      setTimeRemaining(data.timeRemaining);
      if (data.timeRemaining <= 10 && data.timeRemaining > 0) {
        sound.playCountdown();
      }
    });

    socket.on('duel:player_progress', (data: { socketId: string; testsPassed: number; totalTests: number; codeLength: number }) => {
      setDuelPlayers(prev => prev.map(p => p.socketId === data.socketId ? { ...p, ...data } : p));
    });

    socket.on('duel:finished', (data: { winner: any; reason: string }) => {
      setMatchState('finished');
      setDuelWinner(data.winner);
      setFinishReason(data.reason);

      if (data.winner?.userId === user?.id) {
        sound.playLevelUp();
        confetti({ particleCount: 100, spread: 80 });
        refreshUser();
      } else {
        sound.playError();
      }
    });

    // Quiz Royale events
    socket.on('quiz:lobby_update', (data: { room: any }) => {
      setQuizLobby(data.room);
      setMatchState('in_room');
      setQuizScores(data.room.players);
    });

    socket.on('quiz:new_round', (data: { roundNumber: number; totalRounds: number; question: any; timeRemaining: number }) => {
      sound.playClick();
      setMatchState('battling');
      setQuizRound(data.roundNumber);
      setQuizQuestion(data.question);
      setQuizTimeRemaining(data.timeRemaining);
      setQuizAnswered(false);
    });

    socket.on('quiz:timer_tick', (data: { timeRemaining: number }) => {
      setQuizTimeRemaining(data.timeRemaining);
    });

    socket.on('quiz:scores_updated', (data: { players: any[] }) => {
      setQuizScores(data.players);
    });

    socket.on('quiz:game_over', (data: { podium: any[] }) => {
      setMatchState('finished');
      setQuizPodium(data.podium);
      sound.playLevelUp();
      confetti({ particleCount: 80 });
      refreshUser();
    });

    return () => {
      socket.off('duel:queued');
      socket.off('duel:room_created');
      socket.off('duel:matched');
      socket.off('duel:timer_tick');
      socket.off('duel:player_progress');
      socket.off('duel:finished');
      socket.off('quiz:lobby_update');
      socket.off('quiz:new_round');
      socket.off('quiz:timer_tick');
      socket.off('quiz:scores_updated');
      socket.off('quiz:game_over');
    };
  }, [socket, user]);

  // Find 1v1 Match
  const handleFindMatch = () => {
    sound.playClick();
    setMatchState('searching');
    socket.emit('duel:find_match', {
      userId: user?.id || 'demo-user',
      name: user?.name || 'Coder Initiate',
      avatar: user?.avatar || 'avatar-cyber-ninja',
      college: user?.college || 'IIT Bombay'
    });
  };

  // Create Private Room
  const handleCreatePrivate = () => {
    sound.playClick();
    socket.emit('duel:create_private', {
      userId: user?.id || 'demo-user',
      name: user?.name || 'Coder Initiate',
      avatar: user?.avatar || 'avatar-cyber-ninja',
      college: user?.college || 'IIT Bombay'
    });
  };

  // Join Private Room
  const handleJoinPrivate = () => {
    if (!inputRoomCode) return;
    sound.playClick();
    socket.emit('duel:join_private', {
      roomId: inputRoomCode.toUpperCase(),
      userId: user?.id || 'demo-user',
      name: user?.name || 'Coder Initiate',
      avatar: user?.avatar || 'avatar-cyber-ninja',
      college: user?.college || 'IIT Bombay'
    });
  };

  // Submit Duel Code
  const handleSubmitDuel = () => {
    sound.playClick();
    socket.emit('duel:submit_solution', {
      roomId,
      code: myCode,
      language: user?.preferredLanguage || 'javascript'
    });
  };

  // Join Quiz Royale
  const handleJoinQuizRoyale = () => {
    sound.playClick();
    setMatchState('searching');
    socket.emit('quiz:quick_join', {
      userId: user?.id || 'demo-user',
      name: user?.name || 'Coder Initiate',
      avatar: user?.avatar || 'avatar-cyber-ninja'
    });
  };

  // Submit Quiz Answer
  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered) return;
    sound.playClick();
    setQuizAnswered(true);
    socket.emit('quiz:submit_answer', {
      roomId: quizLobby?.roomId,
      answerIndex: idx
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-600/40 text-rose-300 text-xs font-semibold mb-3">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Real-Time Socket.IO Multiplayer Arena</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-gaming text-white">
          Live Coding Battles & Royale
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Test your algorithmic speed in synchronous 1v1 live duels, or join 4-player high-speed trivia showdowns.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            sound.playClick();
            setMode('duel');
            setMatchState('idle');
          }}
          className={`px-5 py-2.5 rounded-xl border text-xs font-gaming font-semibold flex items-center gap-2 transition-all ${
            mode === 'duel'
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-lg'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4 text-rose-400" />
          <span>1v1 Code Duel (Ranked)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setMode('quiz_royale');
            setMatchState('idle');
          }}
          className={`px-5 py-2.5 rounded-xl border text-xs font-gaming font-semibold flex items-center gap-2 transition-all ${
            mode === 'quiz_royale'
              ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-lg'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>4-Player Quiz Royale</span>
        </button>
      </div>

      {/* ================= 1v1 CODE DUEL FLOW ================= */}
      {mode === 'duel' && (
        <div className="max-w-4xl mx-auto">
          
          {/* IDLE / LOBBY SELECTION */}
          {matchState === 'idle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Quick Matchmaking Card */}
              <div className="p-6 rounded-3xl bg-[#0c1224] border border-rose-800/40 shadow-xl flex flex-col justify-between text-center">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center mx-auto mb-4">
                    <Swords className="w-7 h-7 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold font-gaming text-white">Instant Ranked Matchmaking</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Queue against live peers or our sparring AI rival bot. 180 seconds. First to pass all test cases takes +250 XP!
                  </p>
                </div>
                <button
                  onClick={handleFindMatch}
                  className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-gaming font-bold text-xs tracking-wider uppercase shadow-lg shadow-rose-900/40 hover:scale-105 transition-all"
                >
                  FIND OPPONENT NOW
                </button>
              </div>

              {/* Private Room Card */}
              <div className="p-6 rounded-3xl bg-[#0c1224] border border-purple-800/40 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold font-gaming text-white text-center">Private Friend Room</h3>
                  <p className="text-xs text-slate-300 mt-2 text-center leading-relaxed">
                    Create a private duel room with an invite code or join a friend's room.
                  </p>

                  <div className="mt-5 space-y-3">
                    <button
                      onClick={handleCreatePrivate}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-gaming text-xs font-semibold"
                    >
                      Create Private Room
                    </button>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputRoomCode}
                        onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                        placeholder="ENTER 6-DIGIT CODE"
                        className="flex-1 px-3 py-2 bg-[#060a14] border border-slate-700 rounded-xl text-xs text-white font-mono uppercase text-center focus:outline-none focus:border-cyan-400"
                        maxLength={6}
                      />
                      <button
                        onClick={handleJoinPrivate}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-gaming text-xs font-semibold rounded-xl"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SEARCHING STATE */}
          {matchState === 'searching' && (
            <div className="p-12 rounded-3xl bg-[#0c1224] border border-rose-800/60 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto" />
              <h3 className="text-xl font-bold font-gaming text-white">Scanning Ranked Queue...</h3>
              <p className="text-xs text-slate-400">Finding a worthy coder knight from Indian engineering universities.</p>
              <button
                onClick={() => setMatchState('idle')}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Cancel Queue
              </button>
            </div>
          )}

          {/* IN ROOM WAITING FOR OPPONENT */}
          {matchState === 'in_room' && (
            <div className="p-8 rounded-3xl bg-[#0c1224] border border-purple-800/60 text-center space-y-4">
              <h3 className="text-xl font-bold font-gaming text-white">Private Room Created!</h3>
              <p className="text-xs text-slate-400">Share this room code with your friend to start the duel:</p>
              
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-black/60 border border-cyan-400 font-mono text-2xl font-bold text-cyan-300 tracking-widest">
                <span>{roomId}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <p className="text-xs text-purple-300 animate-pulse">Waiting for opponent to connect...</p>
            </div>
          )}

          {/* ACTIVE BATTLING STAGE */}
          {matchState === 'battling' && duelChallenge && (
            <div className="space-y-4">
              
              {/* Battle HUD Bar */}
              <div className="p-4 rounded-2xl bg-[#0b1020] border border-purple-900/60 flex items-center justify-between">
                
                {/* Player 1 (You) */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500 flex items-center justify-center text-xl">
                    🥷
                  </div>
                  <div>
                    <span className="text-xs font-bold font-gaming text-white">{user?.name} (You)</span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>Tests: <strong className="text-cyan-300">{duelPlayers.find(p => p.userId === user?.id)?.testsPassed || 0}/{duelChallenge.testCases.length}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Match Timer */}
                <div className="text-center">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono font-bold text-lg">
                    <Clock className="w-4 h-4 text-rose-400" />
                    <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">1v1 CODING DUEL</span>
                </div>

                {/* Player 2 (Opponent) */}
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-xs font-bold font-gaming text-white">
                      {duelPlayers.find(p => p.userId !== user?.id)?.name || 'Opponent'}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 justify-end">
                      <span>Tests: <strong className="text-rose-400">{duelPlayers.find(p => p.userId !== user?.id)?.testsPassed || 0}/{duelChallenge.testCases.length}</strong></span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500 flex items-center justify-center text-xl">
                    🤖
                  </div>
                </div>

              </div>

              {/* Challenge Banner */}
              <div className="p-4 rounded-xl bg-[#090d18] border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <span className="text-purple-400 font-bold uppercase font-mono">{duelChallenge.title}:</span>{' '}
                  <span className="text-slate-300">{duelChallenge.description}</span>
                </div>
                <button
                  onClick={handleSubmitDuel}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-gaming text-xs font-bold shadow-lg shadow-rose-900/50 hover:opacity-95"
                >
                  SUBMIT CODE (EVALUATE)
                </button>
              </div>

              {/* Code Editor */}
              <div className="h-96 rounded-2xl border border-purple-900/60 overflow-hidden shadow-2xl">
                <Editor
                  height="100%"
                  language="javascript"
                  value={myCode}
                  onChange={(val) => {
                    setMyCode(val || '');
                    socket.emit('duel:code_update', { roomId, codeLength: (val || '').length });
                  }}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: '"Fira Code", monospace',
                    minimap: { enabled: false }
                  }}
                />
              </div>

            </div>
          )}

          {/* DUEL FINISHED MODAL */}
          {matchState === 'finished' && (
            <div className="p-10 rounded-3xl bg-[#0c1224] border border-purple-600/60 text-center space-y-4 shadow-2xl">
              {duelWinner?.userId === user?.id ? (
                <>
                  <Trophy className="w-16 h-16 text-yellow-400 animate-bounce mx-auto" />
                  <h3 className="text-2xl font-bold font-gaming text-emerald-400">VICTORY!</h3>
                  <p className="text-xs text-slate-300">{finishReason}</p>
                  <p className="text-base font-mono font-bold text-yellow-400">+250 XP & +150 Coins Awarded!</p>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
                  <h3 className="text-2xl font-bold font-gaming text-rose-400">MATCH CONCLUDED</h3>
                  <p className="text-xs text-slate-300">{finishReason}</p>
                </>
              )}
              <button
                onClick={() => setMatchState('idle')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-semibold"
              >
                Return to Battle Hub
              </button>
            </div>
          )}

        </div>
      )}

      {/* ================= 4-PLAYER QUIZ ROYALE FLOW ================= */}
      {mode === 'quiz_royale' && (
        <div className="max-w-3xl mx-auto">
          {matchState === 'idle' && (
            <div className="p-8 rounded-3xl bg-[#0c1224] border border-purple-800/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-500 flex items-center justify-center mx-auto text-3xl">
                👑
              </div>
              <h3 className="text-2xl font-bold font-gaming text-white">4-Player High-Speed Trivia Royale</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                5 consecutive timed questions (15s each). Points calculated based on accuracy and answering speed. Highest score takes the championship crown!
              </p>
              <button
                onClick={handleJoinQuizRoyale}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-gaming font-bold text-xs uppercase shadow-lg shadow-purple-900/50"
              >
                JOIN QUIZ ROYALE LOBBY
              </button>
            </div>
          )}

          {matchState === 'searching' && (
            <div className="p-10 rounded-3xl bg-[#0c1224] border border-purple-800/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mx-auto" />
              <h3 className="text-lg font-bold font-gaming text-white">Assembling Contenders...</h3>
              <p className="text-xs text-slate-400">Match starts automatically when players arrive.</p>
            </div>
          )}

          {matchState === 'battling' && quizQuestion && (
            <div className="space-y-6">
              
              {/* Round & Timer Header */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0b1020] border border-purple-900/60">
                <span className="text-xs font-bold font-gaming text-purple-300">
                  ROUND {quizRound} / 5
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950 border border-purple-700 text-cyan-300 font-mono font-bold text-base">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>{quizTimeRemaining}s</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{quizQuestion.category}</span>
              </div>

              {/* Question Card */}
              <div className="p-6 rounded-3xl bg-[#0e1628] border border-purple-800/40 shadow-xl space-y-4">
                <h3 className="text-lg font-bold font-gaming text-white">
                  {quizQuestion.question}
                </h3>

                {quizQuestion.codeSnippet && (
                  <pre className="p-3 rounded-xl bg-[#060a14] border border-slate-800 font-mono text-xs text-cyan-300">
                    {quizQuestion.codeSnippet}
                  </pre>
                )}

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {quizQuestion.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      disabled={quizAnswered}
                      onClick={() => handleQuizAnswer(idx)}
                      className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all ${
                        quizAnswered
                          ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-[#090e1a] border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 text-slate-200 hover:text-white'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-black/40 border border-slate-700 inline-flex items-center justify-center mr-2 text-[10px] font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Scoreboard */}
              <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-gaming block mb-2">
                  Live Royale Scoreboard
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quizScores.map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#060a14] border border-slate-800/60 text-center">
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-xs font-mono font-bold text-yellow-400 mt-0.5">{p.score} pts</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* QUIZ OVER PODIUM */}
          {matchState === 'finished' && quizPodium && (
            <div className="p-8 rounded-3xl bg-[#0c1224] border border-purple-600/60 text-center space-y-4">
              <Trophy className="w-16 h-16 text-yellow-400 animate-bounce mx-auto" />
              <h3 className="text-2xl font-bold font-gaming text-white">Quiz Royale Podium</h3>
              
              <div className="space-y-2 max-w-sm mx-auto">
                {quizPodium.map((p, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs font-gaming font-semibold ${
                    idx === 0 ? 'bg-yellow-950/40 border-yellow-500 text-yellow-300' :
                    idx === 1 ? 'bg-slate-800 border-slate-500 text-slate-200' : 'bg-amber-950/20 border-amber-800 text-amber-300'
                  }`}>
                    <span>#{idx + 1} {p.name}</span>
                    <span className="font-mono">{p.score} pts</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setMatchState('idle')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-gaming text-xs font-semibold"
              >
                Play Another Royale
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
