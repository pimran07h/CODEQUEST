import { Server, Socket } from 'socket.io';
import { db } from '../services/store.js';
import { WORLDS } from '../data/worlds.js';
import { QUIZ_QUESTIONS } from '../data/quizzes.js';
import { executeCode } from '../services/codeExecution.js';
import { Language } from '../types.js';

interface DuelRoom {
  roomId: string;
  isPrivate: boolean;
  players: {
    socketId: string;
    userId: string;
    name: string;
    college: string;
    avatar: string;
    testsPassed: number;
    totalTests: number;
    codeLength: number;
    hasSubmitted: boolean;
    isWinner: boolean;
  }[];
  challenge: any;
  startTime: number;
  timeRemaining: number;
  status: 'waiting' | 'active' | 'finished';
  timerInterval?: NodeJS.Timeout;
}

interface QuizRoom {
  roomId: string;
  players: {
    socketId: string;
    userId: string;
    name: string;
    avatar: string;
    score: number;
    hasAnsweredCurrentRound: boolean;
  }[];
  questions: any[];
  currentRound: number;
  totalRounds: number;
  roundTimeRemaining: number;
  status: 'waiting' | 'in_round' | 'round_result' | 'game_over';
  timerInterval?: NodeJS.Timeout;
}

export function setupMultiplayer(io: Server) {
  const duelRooms: Map<string, DuelRoom> = new Map();
  const quizRooms: Map<string, QuizRoom> = new Map();
  const matchmakingQueue: { socketId: string; userId: string; name: string; avatar: string; college: string }[] = [];

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // ================= 1v1 CODING DUEL =================
    socket.on('duel:find_match', (data: { userId: string; name: string; avatar: string; college: string }) => {
      // Check if another player is in queue
      const existing = matchmakingQueue.shift();

      if (existing && existing.socketId !== socket.id) {
        // Create active room for both
        const roomId = `duel-${Date.now().toString(36)}`;
        const challenge = WORLDS[1].challenges[1]; // Factorial or Leap Year

        const room: DuelRoom = {
          roomId,
          isPrivate: false,
          players: [
            {
              socketId: existing.socketId,
              userId: existing.userId,
              name: existing.name,
              college: existing.college,
              avatar: existing.avatar,
              testsPassed: 0,
              totalTests: challenge.testCases.length,
              codeLength: 0,
              hasSubmitted: false,
              isWinner: false
            },
            {
              socketId: socket.id,
              userId: data.userId,
              name: data.name,
              college: data.college,
              avatar: data.avatar,
              testsPassed: 0,
              totalTests: challenge.testCases.length,
              codeLength: 0,
              hasSubmitted: false,
              isWinner: false
            }
          ],
          challenge,
          startTime: Date.now(),
          timeRemaining: 180, // 3 minutes
          status: 'active'
        };

        duelRooms.set(roomId, room);
        socket.join(roomId);
        io.sockets.sockets.get(existing.socketId)?.join(roomId);

        io.to(roomId).emit('duel:matched', {
          roomId,
          challenge,
          timeRemaining: room.timeRemaining,
          players: room.players
        });

        // Start room timer
        room.timerInterval = setInterval(() => {
          room.timeRemaining--;
          io.to(roomId).emit('duel:timer_tick', { timeRemaining: room.timeRemaining });

          if (room.timeRemaining <= 0) {
            clearInterval(room.timerInterval);
            room.status = 'finished';
            io.to(roomId).emit('duel:finished', {
              winner: null,
              reason: 'Time expired! Match ended in a draw.'
            });
          }
        }, 1000);

      } else {
        // Add to queue
        matchmakingQueue.push({
          socketId: socket.id,
          userId: data.userId,
          name: data.name,
          avatar: data.avatar,
          college: data.college
        });
        socket.emit('duel:queued');

        // AI Bot Fallback if waiting > 4 seconds
        setTimeout(() => {
          const index = matchmakingQueue.findIndex(q => q.socketId === socket.id);
          if (index !== -1) {
            matchmakingQueue.splice(index, 1);
            // Spawn Rival Bot
            const roomId = `duel-bot-${Date.now().toString(36)}`;
            const challenge = WORLDS[0].challenges[3]; // Bitwise Obelisk

            const room: DuelRoom = {
              roomId,
              isPrivate: false,
              players: [
                {
                  socketId: socket.id,
                  userId: data.userId,
                  name: data.name,
                  college: data.college,
                  avatar: data.avatar,
                  testsPassed: 0,
                  totalTests: challenge.testCases.length,
                  codeLength: 0,
                  hasSubmitted: false,
                  isWinner: false
                },
                {
                  socketId: 'bot-rival-ai',
                  userId: 'bot-1',
                  name: 'Apex Coder (AI Rival)',
                  college: 'Cyber Valley Tech',
                  avatar: 'avatar-mecha-knight',
                  testsPassed: 0,
                  totalTests: challenge.testCases.length,
                  codeLength: 0,
                  hasSubmitted: false,
                  isWinner: false
                }
              ],
              challenge,
              startTime: Date.now(),
              timeRemaining: 180,
              status: 'active'
            };

            duelRooms.set(roomId, room);
            socket.join(roomId);

            socket.emit('duel:matched', {
              roomId,
              challenge,
              timeRemaining: room.timeRemaining,
              players: room.players
            });

            // Simulate Bot Progress gradually
            let botProgress = 0;
            const botProgressInterval = setInterval(() => {
              if (room.status !== 'active') {
                clearInterval(botProgressInterval);
                return;
              }
              botProgress++;
              const bot = room.players.find(p => p.socketId === 'bot-rival-ai');
              if (bot) {
                bot.testsPassed = Math.min(botProgress, challenge.testCases.length - 1);
                bot.codeLength += 45;
                io.to(roomId).emit('duel:player_progress', {
                  socketId: 'bot-rival-ai',
                  testsPassed: bot.testsPassed,
                  totalTests: challenge.testCases.length,
                  codeLength: bot.codeLength
                });
              }
            }, 12000);

            // Timer
            room.timerInterval = setInterval(() => {
              room.timeRemaining--;
              io.to(roomId).emit('duel:timer_tick', { timeRemaining: room.timeRemaining });

              if (room.timeRemaining <= 0) {
                clearInterval(room.timerInterval);
                clearInterval(botProgressInterval);
                room.status = 'finished';
                io.to(roomId).emit('duel:finished', {
                  winner: null,
                  reason: 'Time expired!'
                });
              }
            }, 1000);
          }
        }, 3500);
      }
    });

    // Create Private Duel Room
    socket.on('duel:create_private', (data: { userId: string; name: string; avatar: string; college: string }) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const challenge = WORLDS[2].challenges[0]; // Palindrome Grove

      const room: DuelRoom = {
        roomId,
        isPrivate: true,
        players: [
          {
            socketId: socket.id,
            userId: data.userId,
            name: data.name,
            college: data.college,
            avatar: data.avatar,
            testsPassed: 0,
            totalTests: challenge.testCases.length,
            codeLength: 0,
            hasSubmitted: false,
            isWinner: false
          }
        ],
        challenge,
        startTime: Date.now(),
        timeRemaining: 180,
        status: 'waiting'
      };

      duelRooms.set(roomId, room);
      socket.join(roomId);
      socket.emit('duel:room_created', { roomId, room });
    });

    // Join Private Duel Room
    socket.on('duel:join_private', (data: { roomId: string; userId: string; name: string; avatar: string; college: string }) => {
      const room = duelRooms.get(data.roomId.toUpperCase());
      if (!room || room.players.length >= 2 || room.status !== 'waiting') {
        socket.emit('duel:error', { message: 'Room is invalid, expired, or already full.' });
        return;
      }

      room.players.push({
        socketId: socket.id,
        userId: data.userId,
        name: data.name,
        college: data.college,
        avatar: data.avatar,
        testsPassed: 0,
        totalTests: room.challenge.testCases.length,
        codeLength: 0,
        hasSubmitted: false,
        isWinner: false
      });

      room.status = 'active';
      socket.join(room.roomId);

      io.to(room.roomId).emit('duel:matched', {
        roomId: room.roomId,
        challenge: room.challenge,
        timeRemaining: room.timeRemaining,
        players: room.players
      });

      // Timer
      room.timerInterval = setInterval(() => {
        room.timeRemaining--;
        io.to(room.roomId).emit('duel:timer_tick', { timeRemaining: room.timeRemaining });

        if (room.timeRemaining <= 0) {
          clearInterval(room.timerInterval);
          room.status = 'finished';
          io.to(room.roomId).emit('duel:finished', { winner: null, reason: 'Time expired!' });
        }
      }, 1000);
    });

    // Player typing sync
    socket.on('duel:code_update', (data: { roomId: string; codeLength: number }) => {
      const room = duelRooms.get(data.roomId);
      if (!room) return;
      const player = room.players.find(p => p.socketId === socket.id);
      if (player) {
        player.codeLength = data.codeLength;
        socket.to(data.roomId).emit('duel:opponent_typing', { codeLength: data.codeLength });
      }
    });

    // Player test / submit solution
    socket.on('duel:submit_solution', (data: { roomId: string; code: string; language: Language }) => {
      const room = duelRooms.get(data.roomId);
      if (!room || room.status !== 'active') return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      // Run execution
      const result = executeCode({
        code: data.code,
        language: data.language,
        testCases: room.challenge.testCases
      });

      player.testsPassed = result.testsPassed;

      // Broadcast progress to opponent
      io.to(data.roomId).emit('duel:player_progress', {
        socketId: socket.id,
        testsPassed: result.testsPassed,
        totalTests: room.challenge.testCases.length,
        codeLength: data.code.length
      });

      if (result.allPassed) {
        // Victory!
        player.hasSubmitted = true;
        player.isWinner = true;
        room.status = 'finished';
        if (room.timerInterval) clearInterval(room.timerInterval);

        // Award rewards
        try {
          db.awardXP(player.userId, 250, 150);
        } catch {}

        io.to(data.roomId).emit('duel:finished', {
          winner: player,
          reason: `${player.name} passed all test cases in ${180 - room.timeRemaining}s!`
        });
      } else {
        socket.emit('duel:test_result', result);
      }
    });

    // ================= 4-PLAYER QUIZ ROYALE =================
    socket.on('quiz:quick_join', (data: { userId: string; name: string; avatar: string }) => {
      // Find open quiz room or create
      let room = Array.from(quizRooms.values()).find(r => r.status === 'waiting' && r.players.length < 4);

      if (!room) {
        const roomId = `quiz-${Date.now().toString(36)}`;
        room = {
          roomId,
          players: [],
          questions: QUIZ_QUESTIONS.slice(0, 5),
          currentRound: 0,
          totalRounds: 5,
          roundTimeRemaining: 15,
          status: 'waiting'
        };
        quizRooms.set(roomId, room);
      }

      room.players.push({
        socketId: socket.id,
        userId: data.userId,
        name: data.name,
        avatar: data.avatar,
        score: 0,
        hasAnsweredCurrentRound: false
      });

      socket.join(room.roomId);
      io.to(room.roomId).emit('quiz:lobby_update', { room });

      // Automatically start when 2+ players or after 4s with AI players
      if (room.players.length >= 2 && room.status === 'waiting') {
        startQuizCountdown(io, room);
      } else if (room.players.length === 1) {
        setTimeout(() => {
          if (room && room.status === 'waiting' && room.players.length < 2) {
            // Add virtual contenders
            room.players.push(
              { socketId: 'ai-1', userId: 'ai-u1', name: 'DevBot Alpha', avatar: 'avatar-cyber-hacker', score: 0, hasAnsweredCurrentRound: false },
              { socketId: 'ai-2', userId: 'ai-u2', name: 'NeuralNet Girl', avatar: 'avatar-arcane-sorceress', score: 0, hasAnsweredCurrentRound: false }
            );
            startQuizCountdown(io, room);
          }
        }, 3000);
      }
    });

    socket.on('quiz:submit_answer', (data: { roomId: string; answerIndex: number }) => {
      const room = quizRooms.get(data.roomId);
      if (!room || room.status !== 'in_round') return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player || player.hasAnsweredCurrentRound) return;

      player.hasAnsweredCurrentRound = true;
      const currentQ = room.questions[room.currentRound];

      const isCorrect = data.answerIndex === currentQ.correctAnswer;
      if (isCorrect) {
        // Speed bonus: up to 100 points + time remaining * 10
        const points = 100 + room.roundTimeRemaining * 10;
        player.score += points;
      }

      socket.emit('quiz:answer_result', {
        isCorrect,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        score: player.score
      });

      io.to(room.roomId).emit('quiz:scores_updated', { players: room.players });
    });

    socket.on('disconnect', () => {
      // Remove from queue
      const qIdx = matchmakingQueue.findIndex(q => q.socketId === socket.id);
      if (qIdx !== -1) matchmakingQueue.splice(qIdx, 1);
    });
  });
}

function startQuizCountdown(io: Server, room: QuizRoom) {
  room.status = 'in_round';
  room.currentRound = 0;
  runQuizRound(io, room);
}

function runQuizRound(io: Server, room: QuizRoom) {
  if (room.currentRound >= room.totalRounds) {
    room.status = 'game_over';
    const sorted = [...room.players].sort((a, b) => b.score - a.score);
    io.to(room.roomId).emit('quiz:game_over', { podium: sorted });
    return;
  }

  room.status = 'in_round';
  room.roundTimeRemaining = 15;
  room.players.forEach(p => p.hasAnsweredCurrentRound = false);

  const question = room.questions[room.currentRound];
  io.to(room.roomId).emit('quiz:new_round', {
    roundNumber: room.currentRound + 1,
    totalRounds: room.totalRounds,
    question: {
      id: question.id,
      question: question.question,
      options: question.options,
      category: question.category,
      codeSnippet: question.codeSnippet
    },
    timeRemaining: room.roundTimeRemaining
  });

  // Round Timer
  if (room.timerInterval) clearInterval(room.timerInterval);
  room.timerInterval = setInterval(() => {
    room.roundTimeRemaining--;
    io.to(room.roomId).emit('quiz:timer_tick', { timeRemaining: room.roundTimeRemaining });

    // Simulate AI player answers
    if (room.roundTimeRemaining === 8) {
      room.players.forEach(p => {
        if (p.socketId.startsWith('ai-') && !p.hasAnsweredCurrentRound) {
          p.hasAnsweredCurrentRound = true;
          if (Math.random() > 0.3) {
            p.score += 150;
          }
        }
      });
      io.to(room.roomId).emit('quiz:scores_updated', { players: room.players });
    }

    if (room.roundTimeRemaining <= 0) {
      clearInterval(room.timerInterval);
      room.status = 'round_result';
      io.to(room.roomId).emit('quiz:round_ended', {
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        players: room.players
      });

      // Advance to next round in 3 seconds
      setTimeout(() => {
        room.currentRound++;
        runQuizRound(io, room);
      }, 3000);
    }
  }, 1000);
}
