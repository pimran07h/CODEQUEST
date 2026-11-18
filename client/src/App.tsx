import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// 15 Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorldsPage } from './pages/WorldsPage';
import { AdventureGamePage } from './pages/AdventureGamePage';
import { PuzzleArenaPage } from './pages/PuzzleArenaPage';
import { CodingArenaPage } from './pages/CodingArenaPage';
import { MultiplayerBattlePage } from './pages/MultiplayerBattlePage';
import { QuizCompetitionPage } from './pages/QuizCompetitionPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppLayout: React.FC = () => {
  const location = useLocation();

  // Full-screen dedicated games & title screen hide default page navbar & footer for 100% immersive viewport
  const isTitleScreen = location.pathname === '/';
  const isDedicatedFullscreenGame = location.pathname.startsWith('/adventure') || isTitleScreen;
  const isCodingArena = location.pathname.startsWith('/arena');

  return (
    <div className="flex flex-col min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Hide standard navbar on full-screen 3D adventure game */}
      {!isDedicatedFullscreenGame && <Navbar />}

      <main className="flex-1 flex flex-col">
        <Routes>
          {/* 1. Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Registration Page */}
          <Route path="/register" element={<RegisterPage />} />

          {/* 4. Student Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* 5. Game World Selection */}
          <Route path="/worlds" element={<WorldsPage />} />
          <Route path="/worlds/:worldId" element={<WorldsPage />} />

          {/* 6. 3D Adventure Game (Full-Screen Edge-to-Edge) */}
          <Route path="/adventure" element={<AdventureGamePage />} />

          {/* 7. 2D Puzzle Arena */}
          <Route path="/puzzles" element={<PuzzleArenaPage />} />

          {/* 8. Coding Arena */}
          <Route path="/arena" element={<CodingArenaPage />} />
          <Route path="/arena/:challengeId" element={<CodingArenaPage />} />

          {/* 9. Multiplayer Battle Arena */}
          <Route path="/multiplayer" element={<MultiplayerBattlePage />} />

          {/* 10. Quiz Competition */}
          <Route path="/quiz" element={<QuizCompetitionPage />} />

          {/* 11. Leaderboard */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />

          {/* 12. Student Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* 13. Achievements */}
          <Route path="/achievements" element={<AchievementsPage />} />

          {/* 14. Daily Challenges */}
          <Route path="/daily" element={<DailyChallengePage />} />

          {/* 15. Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Hide footer on full-screen 3D adventure and coding arena for maximum workspace */}
      {!isDedicatedFullscreenGame && !isCodingArena && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
