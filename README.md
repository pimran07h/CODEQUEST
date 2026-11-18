# 🎮 CODEQUEST — Play. Code. Conquer.

> **Next-Generation Gamified Programming Learning Platform for B.Tech Engineering Students (1st to 4th Year)**  
> *Play. Code. Conquer.*

[![CodeQuest Demo](https://img.shields.io/badge/Status-Fully%20Playable-success?style=for-the-badge&logo=react)](http://localhost:4000)
[![Tech Stack](https://img.shields.io/badge/Tech-React%2018%20%7C%20TypeScript%20%7C%20Three.js%20%7C%20Node.js%20%7C%20Socket.IO-blueviolet?style=for-the-badge)](http://localhost:4000)

---

## 🌟 Overview & Objectives

**CODEQUEST** transforms the traditional engineering computer science curriculum into an immersive, high-stakes 3D video game adventure and competitive esports platform. Instead of passive lecture slides, students:
- Explore realistic 3D environments in third-person view with natural movement mechanics.
- Encounter story-driven cliffhanger coding gates before entering ancient ruins.
- Solve 2D algorithmic puzzles and debugging mazes.
- Compete in live 1v1 coding duels and 4-player Quiz Royales via WebSockets.
- Practice in an isolated Monaco IDE backed by a Socratic AI Coding Tutor ("Professor Turing").
- Enjoy full-screen immersive display with zero layout distractions.

---

## 🚀 Game Modes & Key Features

### 1. 🗿 Chapter 1: The Lost Temple (Realistic 3D Third-Person Adventure)
- **Cinematic Environment**: Lush tropical jungle with towering ancient trees, swaying vines, flowing mountain river, cascading waterfall, and moss-covered stone ruins.
- **Realistic Explorer Character**: Third-person camera control with full movement mechanics (Walk `W/A/S/D`, Sprint `Shift`, Jump `Space`, Interact `E`).
- **Interactive Story & Discoveries**: Search the jungle for ancient explorer journal notes that reveal clues about the temple's security mechanism.
- **Cliffhanger Coding Gate**: Approaching the massive locked temple door triggers a cinematic security alarm:
  - *Challenge*: Python loop sequence decryption (`for i in range(1, 6): print(i)`).
  - *Live Execution*: Real-time code execution with test case validation.
  - *Success*: Ancient stone doors slide open with cinematic camera panning, environmental audio, and access to the underground treasure chamber.
  - *Failure Safe*: Offers Option A (Retry with hints) or Option B (Alternative route through the secondary temple entrance).
- **True Full-Screen Support**: Dedicated fullscreen toggle button (`Maximize2` / `Minimize2`) leveraging the native HTML5 Fullscreen API.

### 2. 🌌 The Six Coding Realms
1. **World 1: Coding Village** *(Novice / 1st Year)*: Variables, Data Types, Standard I/O, Operators. **Boss: Syntax Golem**.
2. **World 2: Logic Dungeon** *(1st–2nd Year)*: If-Else, Loops (While/For), Logic Gates. **Boss: Infinite Loop Beast**.
3. **World 3: Function Forest** *(2nd Year)*: Functions, Recursion, Arrays, String Manipulation. **Boss: Stack Overflow Hydra**.
4. **World 4: OOP City** *(2nd–3rd Year)*: Classes, Objects, Inheritance, Polymorphism, Encapsulation. **Boss: Monolithic Overlord**.
5. **World 5: Data Structure Realm** *(3rd Year)*: Stacks, Queues, Linked Lists, Trees, Graphs. **Boss: Binary Necromancer**.
6. **World 6: Algorithm Arena** *(Placement / 4th Year)*: Binary Search, Sorting, Greedy, Dynamic Programming. **Boss: NP-Hard Titan**.

### 3. 🧩 2D Phaser & Canvas Puzzle Arena
- **Robot Grid Runner**: Navigate loops and conditionals in an obstacle-filled maze to gather crystals and power the exit terminal.
- **Bug Zap Syntax Sentry**: Rapidly identify and zap corrupted bug blocks before they breach the memory firewall.
- **Arcade Fullscreen View**: Dedicated fullscreen button to enlarge the retro gaming cabinet.

### 4. 💻 Professional Monaco Coding Arena
- Multi-Language Support: **C, C++, Python, Java, JavaScript**.
- Isolated code execution sandbox: Zero server vulnerability, millisecond execution metrics, memory tracking.
- Sample Test Cases vs Hidden Test Cases (hidden verification cases strictly evaluated on server).
- Instant reward calculation (XP, Coins, Level Up).

### 5. ⚔️ Live Real-Time Multiplayer (Socket.IO)
- **1v1 Live Code Duels**: Real-time matchmaking queue, private room codes (`JOIN-XXXX`), live synchronized 180s timer, opponent progress tracking (tests passed, code length).
- **4-Player Quiz Royale**: High-speed trivia showdown across 5 synchronized 15-second rounds with speed scoring and victory podium.

### 6. 🤖 Socratic AI Coding Tutor ("Professor Turing")
- Diagnoses syntax and runtime exceptions without giving away the full solution.
- Provides progressive pedagogical hints, line-by-line execution traces, and Big-O efficiency tips.
- Ready for Google Gemini API integration via `GEMINI_API_KEY`.

### 7. 🏆 Gamification & Progress
- **Level & XP Curve**: Level = floor(sqrt(XP / 25)) + 1.
- **Daily Coding Streaks**: 7-day flame calendar with 1.5x bonus rewards.
- **Trophies & Badges**: First Code, Bug Hunter, Logic Master, Speed Coder, World Explorer, Code Champion.
- **Locker & Customization**: Avatars (Cyber Ninja, Arcane Sorceress, Mecha Knight, System Infiltrator) & Neon Skins.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router v6, Lucide Icons |
| **Game Engines** | Three.js, React Three Fiber, React Three Drei, Canvas / Phaser Games |
| **Code IDE** | Monaco Editor (`@monaco-editor/react`) |
| **Backend** | Node.js, Express.js, TypeScript |
| **Multiplayer** | Socket.IO WebSockets |
| **Audio Engine** | Procedural Web Audio API Synthesizer (Zero external mp3 dependencies) |
| **Database** | Supabase Adapter + Local Persistent In-Memory State |

---

## 🏃 Quick Start Guide

### 1. Launch Server & App (Single Unified Command)
```bash
cd server
npm start
```
The unified production server starts on **`http://localhost:4000`** and serves both the full React frontend and the backend API & Socket.IO hub!

### 2. Direct Routes
- 🌲 **3D Adventure**: `http://localhost:4000/adventure`
- 🧩 **2D Puzzles**: `http://localhost:4000/puzzles`
- 💻 **Coding Arena**: `http://localhost:4000/arena`
- ⚔️ **Multiplayer Battles**: `http://localhost:4000/multiplayer`
- 🎯 **Daily Challenges**: `http://localhost:4000/daily`
- 📊 **Leaderboard**: `http://localhost:4000/leaderboard`
- 🛡️ **Admin Command**: `http://localhost:4000/admin`

---

## 🔐 Environment Variables (Optional)

Create a `.env` file in `server/` to configure external cloud services:
```env
PORT=4000
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
*(Note: CodeQuest is built with complete standalone fallbacks and works out-of-the-box without requiring external API keys).*

---

## 📜 License
MIT License. Built with ❤️ for computer science and engineering students.
