import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminSidebarTab, AdminStats, AdminUser, AdminCategory, ContentReport, AdminAuditLog, MarketplaceListing, CommunityPost, DIYInstructionIdea } from '@/types';
import {
  getAdminOverviewStats,
  getAdminUsers,
  updateUserRole,
  toggleUserStatus,
  getAdminCategories,
  createCategory,
  updateCategory,
  getAdminMarketplaceListings,
  removeMarketplaceListing,
  getAdminCommunityPosts,
  moderateCommunityPost,
  getAdminReports,
  resolveContentReport,
  getAdminReuseIdeas,
  createReuseIdea,
  deleteReuseIdea,
  getAdminAuditLogs,
  verifyAdminPrivileges,
} from '@/services/adminService';
import { getUserAnalyzedProducts, UserAnalyzedProduct } from '@/services/dashboardService';

// Sub views
import { AdminOverviewView } from './views/AdminOverviewView';
import { AdminUsersView } from './views/AdminUsersView';
import { AdminAnalysesView } from './views/AdminAnalysesView';
import { AdminMarketplaceView } from './views/AdminMarketplaceView';
import { AdminCommunityView } from './views/AdminCommunityView';
import { AdminCategoriesView } from './views/AdminCategoriesView';
import { AdminReportsView } from './views/AdminReportsView';
import { AdminAnalyticsView } from './views/AdminAnalyticsView';
import { AdminSettingsView } from './views/AdminSettingsView';

import { Menu, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AdminPage: React.FC = () => {
  const { profile } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab state
  const tabParam = (searchParams.get('tab') as AdminSidebarTab) || 'overview';
  const [currentTab, setCurrentTab] = useState<AdminSidebarTab>(tabParam);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading and verification states
  const [loading, setLoading] = useState(true);
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);

  // Administrative Datasets
  const [stats, setStats] = useState<AdminStats>({
    totalRegisteredUsers: 0,
    totalProductAnalyses: 0,
    totalMarketplaceListings: 0,
    totalCommunityPosts: 0,
    completedReuseActivities: 0,
    totalWasteDivertedKg: 0,
    totalCo2SavedKg: 0,
    pendingReportsCount: 0,
  });

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [analyses, setAnalyses] = useState<UserAnalyzedProduct[]>([]);
  const [reuseIdeas, setReuseIdeas] = useState<DIYInstructionIdea[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Update query params when tab changes
  const handleSelectTab = (tab: AdminSidebarTab) => {
    setCurrentTab(tab);
    setSearchParams({ tab });
  };

  // Sync state if url changes
  useEffect(() => {
    if (tabParam && tabParam !== currentTab) {
      setCurrentTab(tabParam);
    }
  }, [tabParam, currentTab]);

  // Load all admin data
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Verify server-side admin privileges
      const isAuthorized = await verifyAdminPrivileges(profile);
      setIsVerifiedAdmin(isAuthorized);

      if (!isAuthorized) {
        setLoading(false);
        return;
      }

      // 2. Fetch parallel datasets
      const [
        overviewStats,
        userList,
        catList,
        marketListings,
        commPosts,
        contentReports,
        analysisList,
        ideas,
        logs,
      ] = await Promise.all([
        getAdminOverviewStats(),
        getAdminUsers(),
        getAdminCategories(),
        getAdminMarketplaceListings(),
        getAdminCommunityPosts(),
        getAdminReports(),
        getUserAnalyzedProducts(),
        getAdminReuseIdeas(),
        getAdminAuditLogs(),
      ]);

      setStats(overviewStats);
      setUsers(userList);
      setCategories(catList);
      setListings(marketListings);
      setPosts(commPosts);
      setReports(contentReports);
      setAnalyses(analysisList);
      setReuseIdeas(ideas);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      toast.error('Could not synchronize administrative data models.', 'Error loading admin data');
    } finally {
      setLoading(false);
    }
  }, [profile, toast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Handler: Update User Role
  const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    if (!profile) return;
    const res = await updateUserRole(userId, newRole, profile);
    if (res.success) {
      toast.success(
        `User permissions updated to ${newRole.toUpperCase()} and recorded to audit log.`,
        'Role Updated'
      );
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not update role', 'Action Failed');
    }
  };

  // Handler: Toggle User Status
  const handleToggleUserStatus = async (userId: string, newStatus: 'active' | 'suspended', reason: string) => {
    if (!profile) return;
    const res = await toggleUserStatus(userId, newStatus, reason, profile);
    if (res.success) {
      toast.success(
        `Account status updated. Reason recorded in audit trail.`,
        `Account ${newStatus === 'active' ? 'Reactivated' : 'Suspended'}`
      );
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not change status', 'Action Failed');
    }
  };

  // Handler: Create Category
  const handleCreateCategory = async (cat: Omit<AdminCategory, 'createdAt'>) => {
    if (!profile) return;
    const res = await createCategory(cat, profile);
    if (res.success) {
      toast.success(`New category "${cat.name}" added to sorting taxonomy.`, 'Category Created');
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not create category', 'Creation Failed');
    }
  };

  // Handler: Update Category
  const handleUpdateCategory = async (id: string, updates: Partial<AdminCategory>) => {
    if (!profile) return;
    const res = await updateCategory(id, updates, profile);
    if (res.success) {
      toast.success('Category specifications updated and recorded.', 'Category Updated');
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not update category', 'Update Failed');
    }
  };

  // Handler: Remove Marketplace Listing
  const handleRemoveListing = async (listingId: string, title: string, reason: string) => {
    if (!profile) return;
    const res = await removeMarketplaceListing(listingId, title, reason, profile);
    if (res.success) {
      toast.success(
        `Listing removed from circular marketplace. Reason logged in audit records.`,
        'Listing Removed'
      );
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not remove listing', 'Removal Failed');
    }
  };

  // Handler: Moderate Community Post
  const handleModeratePost = async (postId: string, title: string, action: 'take_down' | 'restore', reason: string) => {
    if (!profile) return;
    const res = await moderateCommunityPost(postId, title, action, reason, profile);
    if (res.success) {
      toast.success(
        `Community post moderated successfully.`,
        action === 'take_down' ? 'Blueprint Taken Down' : 'Blueprint Restored'
      );
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not moderate post', 'Moderation Failed');
    }
  };

  // Handler: Resolve Content Report
  const handleResolveReport = async (reportId: string, action: 'resolved' | 'dismissed', notes: string) => {
    if (!profile) return;
    const res = await resolveContentReport(reportId, action, notes, profile);
    if (res.success) {
      toast.success(
        `Content report marked as ${action.toUpperCase()}. Audit entry recorded.`,
        action === 'resolved' ? 'Report Resolved' : 'Report Dismissed'
      );
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not resolve report', 'Action Failed');
    }
  };

  // Handler: Create DIY Reuse Idea
  const handleCreateReuseIdea = async (idea: Omit<DIYInstructionIdea, 'id'>) => {
    if (!profile) return;
    const res = await createReuseIdea(idea, profile);
    if (res.success) {
      toast.success(`Educational reuse guide published to public library.`, 'Blueprint Published');
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not publish idea', 'Publish Failed');
    }
  };

  // Handler: Delete DIY Reuse Idea
  const handleDeleteReuseIdea = async (id: string, title: string) => {
    if (!profile) return;
    const res = await deleteReuseIdea(id, title, profile);
    if (res.success) {
      toast.success(`Educational DIY guide removed from library.`, 'Blueprint Deleted');
      loadAdminData();
    } else {
      toast.error(res.error || 'Could not delete idea', 'Deletion Failed');
    }
  };

  // Verification Screen if unauthorized
  if (!loading && !isVerifiedAdmin) {
    return (
      <div className="py-24 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold font-display text-forest-900">
          Administrative Authorization Failed
        </h2>
        <p className="text-xs text-dark-muted leading-relaxed">
          Server-level database verification indicates your account does not hold the <code>admin</code> role. All administrative actions require verified staff credentials.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => (window.location.href = '/login?admin=true')}
          >
            Authenticate with Admin Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2E8] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        pendingReportsCount={stats.pendingReportsCount}
        adminEmail={profile?.email || 'admin@reusehub.org'}
        adminName={profile?.fullName || 'Staff Administrator'}
        isMobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile Toggle */}
        <div className="lg:hidden p-4 bg-[#18231C] text-white flex items-center justify-between border-b border-forest-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-xl bg-forest-800 text-forest-200 hover:text-white"
              aria-label="Open administrative navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold font-display">ReUseHub Admin Console</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {currentTab}
          </span>
        </div>

        {/* Tab View Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-forest-800">
                Verifying administrative authorization and loading platform records...
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'overview' && (
                <AdminOverviewView
                  stats={stats}
                  auditLogs={auditLogs}
                  onNavigateTab={handleSelectTab}
                />
              )}

              {currentTab === 'users' && (
                <AdminUsersView
                  users={users}
                  currentAdmin={profile!}
                  onUpdateRole={handleUpdateUserRole}
                  onToggleStatus={handleToggleUserStatus}
                />
              )}

              {currentTab === 'analyses' && (
                <AdminAnalysesView analyses={analyses} />
              )}

              {currentTab === 'marketplace' && (
                <AdminMarketplaceView
                  listings={listings}
                  onRemoveListing={handleRemoveListing}
                />
              )}

              {currentTab === 'community' && (
                <AdminCommunityView
                  posts={posts}
                  onModeratePost={handleModeratePost}
                />
              )}

              {currentTab === 'categories' && (
                <AdminCategoriesView
                  categories={categories}
                  onCreateCategory={handleCreateCategory}
                  onUpdateCategory={handleUpdateCategory}
                />
              )}

              {currentTab === 'reports' && (
                <AdminReportsView
                  reports={reports}
                  onResolveReport={handleResolveReport}
                />
              )}

              {currentTab === 'analytics' && (
                <AdminAnalyticsView stats={stats} />
              )}

              {currentTab === 'settings' && (
                <AdminSettingsView
                  auditLogs={auditLogs}
                  reuseIdeas={reuseIdeas}
                  onCreateReuseIdea={handleCreateReuseIdea}
                  onDeleteReuseIdea={handleDeleteReuseIdea}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
