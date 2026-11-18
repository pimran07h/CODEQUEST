import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import apiRouter from './routes/api.js';
import { setupMultiplayer } from './socket/multiplayer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

// CORS setup to allow local client access
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CODEQUEST - Play. Code. Conquer.',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Setup Socket.IO for real-time multiplayer
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupMultiplayer(io);

// Static client production serving
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CODEQUEST Core Server Active on http://localhost:${PORT}`);
  console.log(`🎮 Socket.IO Multiplayer Hub Ready`);
  console.log(`🛡️ Isolated Code Execution Engine Mounted`);
  console.log(`🧠 AI Coding Tutor Ready`);
  console.log(`🌐 Full Web App Served at http://localhost:${PORT}`);
  console.log(`===============================================`);
});
