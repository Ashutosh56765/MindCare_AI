import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CrisisBanner } from './components/common/CrisisBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { MoodCheckinPage } from './pages/MoodCheckinPage';
import { ScreeningPage } from './pages/ScreeningPage';
import { SelfCarePage } from './pages/SelfCarePage';
import { HistoryPage } from './pages/HistoryPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Restoring your sanctuary...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
          {/* Universal 24/7 Crisis Access Top Bar */}
          <CrisisBanner />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Routing Container */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/chat" element={<ChatPage />} />
              <Route
                path="/mood-checkin"
                element={
                  <ProtectedRoute>
                    <MoodCheckinPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/screening"
                element={
                  <ProtectedRoute>
                    <ScreeningPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/self-care" element={<SelfCarePage />} />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Calming Global Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
