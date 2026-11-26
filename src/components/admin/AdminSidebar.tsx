import React from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebarTab } from '@/types';
import {
  LayoutDashboard,
  Users,
  Cpu,
  ShoppingBag,
  Sparkles,
  Layers,
  Flag,
  BarChart3,
  Settings,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export interface AdminSidebarProps {
  currentTab: AdminSidebarTab;
  onSelectTab: (tab: AdminSidebarTab) => void;
  pendingReportsCount?: number;
  adminEmail?: string;
  adminName?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingReportsCount = 0,
  adminEmail = 'admin@reusehub.org',
  adminName = 'Administrator',
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: {
    id: AdminSidebarTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'analyses', label: 'Product Analyses', icon: <Cpu className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace Listings', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'community', label: 'Community Posts', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'categories', label: 'Reuse Categories', icon: <Layers className="w-4 h-4" /> },
    {
      id: 'reports',
      label: 'Reports',
      icon: <Flag className="w-4 h-4" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
    },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#18231C] text-forest-100 select-none">
      {/* Brand & Admin Badge */}
      <div className="p-5 border-b border-forest-800/60">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-block">
            <Logo size="sm" variant="icon" />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Console
          </span>
        </div>
        <div className="mt-3">
          <h2 className="text-base font-display font-bold text-white tracking-tight">ReUseHub Admin</h2>
          <p className="text-[11px] text-forest-300">Management & Moderation System</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-forest-400 uppercase">
          Administrative Modules
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-forest-600/30 text-white font-semibold border border-forest-500/30 shadow-soft-xs'
                  : 'text-forest-200 hover:text-white hover:bg-forest-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-emerald-400' : 'text-forest-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin User Card & Return */}
      <div className="p-4 border-t border-forest-800/60 bg-[#121B15] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-700/60 flex items-center justify-center font-bold text-emerald-400 text-xs border border-forest-600/40">
            {adminName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{adminName}</div>
            <div className="text-[10px] text-forest-400 truncate">{adminEmail}</div>
          </div>
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-forest-200 hover:text-white bg-forest-800/40 hover:bg-forest-700/40 border border-forest-700/40 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to ReUseHub</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 border-r border-forest-800/60 sticky top-0 h-screen">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
