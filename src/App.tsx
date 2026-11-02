/**
 * SignalPulse Main Application & Router Configuration
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { PricingPage } from './pages/public/PricingPage';
import { PerformancePage } from './pages/public/PerformancePage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { TermsPage } from './pages/public/TermsPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { DisclaimerPage } from './pages/public/DisclaimerPage';
import { AffiliatePage } from './pages/public/AffiliatePage';
import { VideoGuidePage } from './pages/public/VideoGuidePage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Dashboard Pages
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { SignalsFeedPage } from './pages/dashboard/SignalsFeedPage';
import { SignalDetailPage } from './pages/dashboard/SignalDetailPage';
import { SignalHistoryPage } from './pages/dashboard/SignalHistoryPage';
import { WatchlistPage } from './pages/dashboard/WatchlistPage';
import { RiskCalculatorPage } from './pages/dashboard/RiskCalculatorPage';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { BillingPage } from './pages/dashboard/BillingPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { ReferralsPage } from './pages/dashboard/ReferralsPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSignalsPage } from './pages/admin/AdminSignalsPage';
import { AdminEnginePage } from './pages/admin/AdminEnginePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminInboxPage } from './pages/admin/AdminInboxPage';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/affiliate" element={<AffiliatePage />} />
              <Route path="/guide" element={<VideoGuidePage />} />
              <Route path="/video-guide" element={<VideoGuidePage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* User Dashboard Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OverviewPage />} />
                <Route path="signals" element={<SignalsFeedPage />} />
                <Route path="signals/:id" element={<SignalDetailPage />} />
                <Route path="history" element={<SignalHistoryPage />} />
                <Route path="watchlist" element={<WatchlistPage />} />
                <Route path="calculator" element={<RiskCalculatorPage />} />
                <Route path="referrals" element={<ReferralsPage />} />
                <Route path="affiliate" element={<ReferralsPage />} />
                <Route path="guide" element={<VideoGuidePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Role-Based Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="signals" element={<AdminSignalsPage />} />
                <Route path="engine" element={<AdminEnginePage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="announcements" element={<AdminAnnouncementsPage />} />
                <Route path="inbox" element={<AdminInboxPage />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
