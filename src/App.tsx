import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute, AdminRoute } from '@/components/auth/ProtectedRoute';
import { ScrollToTop } from '@/components/common/ScrollToTop';

// Pages
import { HomePage } from '@/pages/Home/HomePage';
import { ProductAnalyzerPage } from '@/pages/ProductAnalyzer/ProductAnalyzerPage';
import { RecommendationsPage } from '@/pages/Recommendations/RecommendationsPage';
import { DiscoverPage } from '@/pages/Discover/DiscoverPage';
import { MarketplacePage } from '@/pages/Marketplace/MarketplacePage';
import { CommunityPage } from '@/pages/Community/CommunityPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { EcoScorePage } from '@/pages/EcoScore/EcoScorePage';
import { AdminPage } from '@/pages/Admin/AdminPage';
import { DesignSystemPage } from '@/pages/DesignSystem/DesignSystemPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { ForgotPasswordPage } from '@/pages/Auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/Auth/ResetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/analyzer" element={<ProductAnalyzerPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/ecoscore" element={<EcoScorePage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />

              {/* Authentication Routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Member Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
