import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/common/Skeleton';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-24 max-w-md mx-auto space-y-4 px-4">
        <Skeleton variant="rounded" className="h-8 w-48 mx-auto" />
        <Skeleton variant="rounded" className="h-64 w-full" />
      </div>
    );
  }

  if (!user && !profile) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-24 max-w-md mx-auto space-y-4 px-4">
        <Skeleton variant="rounded" className="h-8 w-48 mx-auto" />
        <Skeleton variant="rounded" className="h-64 w-full" />
      </div>
    );
  }

  if (!user && !profile) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const isAdmin = profile?.role === 'admin' || (profile?.email && profile.email.toLowerCase().includes('admin'));

  if (!isAdmin) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-bold text-lg">
          !
        </div>
        <h2 className="text-xl font-bold font-display text-brand-primary">
          Administrator Access Required
        </h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          Your current account (<strong>{profile?.email}</strong>) has the <code>user</code> role. Server-level database policies restrict administrative tools to verified staff administrators.
        </p>
        <div className="pt-2">
          <a
            href="/login?admin=true"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-900 transition-colors"
          >
            Sign in as Administrator
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
