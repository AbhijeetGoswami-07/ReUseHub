import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { AdminStats, AdminAuditLog, AdminSidebarTab } from '@/types';
import {
  Users,
  Cpu,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Flag,
} from 'lucide-react';

export interface AdminOverviewViewProps {
  stats: AdminStats;
  auditLogs: AdminAuditLog[];
  onNavigateTab: (tab: AdminSidebarTab) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  stats,
  auditLogs,
  onNavigateTab,
}) => {
  const primaryStats = [
    {
      label: 'Total Registered Users',
      value: stats.totalRegisteredUsers.toLocaleString(),
      subtext: 'Verified community members',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-100',
      tab: 'users' as AdminSidebarTab,
    },
    {
      label: 'Total Product Analyses',
      value: stats.totalProductAnalyses.toLocaleString(),
      subtext: '5-path lifecycle assessments',
      icon: <Cpu className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50 text-sky-900 border-sky-100',
      tab: 'analyses' as AdminSidebarTab,
    },
    {
      label: 'Total Marketplace Listings',
      value: stats.totalMarketplaceListings.toLocaleString(),
      subtext: 'Active circular rehoming items',
      icon: <ShoppingBag className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 text-amber-900 border-amber-100',
      tab: 'marketplace' as AdminSidebarTab,
    },
    {
      label: 'Total Community Posts',
      value: stats.totalCommunityPosts.toLocaleString(),
      subtext: 'Maker blueprints & DIY guides',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 text-purple-900 border-purple-100',
      tab: 'community' as AdminSidebarTab,
    },
    {
      label: 'Completed Reuse Activities',
      value: stats.completedReuseActivities.toLocaleString(),
      subtext: 'Confirmed waste diversions',
      icon: <CheckCircle2 className="w-5 h-5 text-forest-600" />,
      bg: 'bg-forest-50 text-forest-900 border-forest-100',
      tab: 'analytics' as AdminSidebarTab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Executive Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
            System Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            Live real-time monitoring of user accounts, circular rehoming, and moderation health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('reports')}
            leftIcon={<Flag className="w-4 h-4 text-amber-600" />}
          >
            Review Reports ({stats.pendingReportsCount})
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('categories')}
            leftIcon={<Layers className="w-4 h-4" />}
          >
            Manage Categories
          </Button>
        </div>
      </div>

      {/* Pending Reports Alert if any */}
      {stats.pendingReportsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                {stats.pendingReportsCount} Content Reports Awaiting Moderation
              </h4>
              <p className="text-[11px] text-amber-700">
                User-flagged marketplace listings or community blueprints require administrative review.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateTab('reports')}
            className="shrink-0 text-xs"
          >
            Open Moderation Inbox
          </Button>
        </div>
      )}

      {/* Primary 5 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {primaryStats.map((item) => (
          <Card
            key={item.label}
            variant="bordered"
            className="p-5 bg-white hover:border-forest-300 transition-all cursor-pointer group"
            onClick={() => onNavigateTab(item.tab)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl border ${item.bg}`}>
                {item.icon}
              </div>
              <ArrowRight className="w-4 h-4 text-forest-300 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-display text-forest-900 tracking-tight">
              {item.value}
            </div>
            <div className="text-xs font-semibold text-forest-800 mt-1">{item.label}</div>
            <div className="text-[11px] text-dark-subtle mt-0.5">{item.subtext}</div>
          </Card>
        ))}
      </div>

      {/* Environmental Aggregate Bar */}
      <Card variant="bordered" className="p-6 bg-forest-900 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-forest-800 pb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              EcoScore Impact Tracker
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              Platform-Wide Environmental Diversion
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-xs text-forest-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aggregate Methodology Documented</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1">
            <span className="text-xs text-forest-300">Total Waste Diverted from Landfills</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">
              {stats.totalWasteDivertedKg.toLocaleString()} <span className="text-base text-forest-200 font-normal">kg</span>
            </div>
            <p className="text-[11px] text-forest-300 leading-relaxed">
              Calculated via material density coefficients from verified user actions.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-forest-300">Estimated Greenhouse Gas Avoided</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-sky-400">
              {stats.totalCo2SavedKg.toLocaleString()} <span className="text-base text-forest-200 font-normal">kg CO₂e</span>
            </div>
            <p className="text-[11px] text-forest-300 leading-relaxed">
              Virgin production avoidance factor across textiles, metals, and timber.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-forest-300">Active Content Categories</span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-amber-400">
              9 <span className="text-base text-forest-200 font-normal">Operational</span>
            </div>
            <p className="text-[11px] text-forest-300 leading-relaxed">
              Standardized sorting taxonomies mapped to recycling and DIY guidelines.
            </p>
          </div>
        </div>
      </Card>

      {/* Two Columns: Recent Administrative Audit Trail & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Trail (2 Cols) */}
        <Card variant="bordered" className="lg:col-span-2 p-6 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-forest-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-500" />
              <h3 className="text-sm font-bold text-forest-900">Recent Administrative Audit Trail</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateTab('settings')}
              className="text-xs text-forest-600 hover:text-forest-900"
            >
              View Full Audit Log
            </Button>
          </div>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-dark-muted py-6 text-center">No administrative changes recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-forest-100 bg-forest-50/30 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-forest-900 capitalize">
                        {log.actionType.replace(/_/g, ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest-100 text-forest-700">
                        {log.targetType}
                      </span>
                    </div>
                    <div className="text-dark-subtle text-[11px]">
                      Target: <span className="text-forest-800 font-medium">{log.targetName || log.targetId}</span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-[11px] text-dark-muted">
                        {log.details.reason && `Reason: "${log.details.reason}"`}
                        {log.details.newRole && `Role changed to: ${log.details.newRole}`}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-[11px] text-dark-subtle shrink-0">
                    <div>{log.adminEmail.split('@')[0]}</div>
                    <div className="text-[10px]">{new Date(log.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Operations (1 Col) */}
        <Card variant="bordered" className="p-6 bg-white space-y-4">
          <h3 className="text-sm font-bold text-forest-900 border-b border-forest-100 pb-3">
            Quick Operations
          </h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="w-full text-left p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-forest-900 block">Manage Users</span>
                <span className="text-[11px] text-dark-subtle">Review roles and active statuses</span>
              </div>
              <ArrowRight className="w-4 h-4 text-forest-400" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('marketplace')}
              className="w-full text-left p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-forest-900 block">Moderate Listings</span>
                <span className="text-[11px] text-dark-subtle">Review listings and remove violations</span>
              </div>
              <ArrowRight className="w-4 h-4 text-forest-400" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('community')}
              className="w-full text-left p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-forest-900 block">Community Blueprints</span>
                <span className="text-[11px] text-dark-subtle">Moderate maker guides and steps</span>
              </div>
              <ArrowRight className="w-4 h-4 text-forest-400" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="w-full text-left p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-forest-900 block">DIY Reuse Ideas</span>
                <span className="text-[11px] text-dark-subtle">Publish and edit educational blueprints</span>
              </div>
              <ArrowRight className="w-4 h-4 text-forest-400" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
