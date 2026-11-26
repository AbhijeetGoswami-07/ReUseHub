import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackToTopButton } from '@/components/common/BackToTopButton';
import { useAuth } from '@/contexts/AuthContext';
import { Info, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { isConfigured } = useAuth();
  const [dismissBanner, setDismissBanner] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6EF] text-[#26332B]">
      {!isConfigured && !dismissBanner && (
        <div className="bg-forest-100 text-forest-900 border-b border-forest-200 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-forest-600 shrink-0" />
              <span>
                <strong>System Notice:</strong> ReUseHub is running in interactive demonstration mode. All core recommendation algorithms and UI features are fully active. To synchronize with Supabase Cloud, provide <code className="bg-forest-200 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> in your <code className="bg-forest-200 px-1 py-0.5 rounded font-mono">.env</code>.
              </span>
            </div>
            <button
              onClick={() => setDismissBanner(true)}
              className="p-1 hover:bg-forest-200 rounded text-forest-700"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main sticky navigation */}
      <Navbar />

      {/* Primary content area */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Global Environmental footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};
