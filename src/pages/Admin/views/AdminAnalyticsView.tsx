import React from 'react';
import { Card } from '@/components/common/Card';
import { AdminStats } from '@/types';
import {
  BarChart3,
  TrendingUp,
  Recycle,
  Repeat,
  Wrench,
  Sparkles,
  HeartHandshake,
  Leaf,
  Scale,
} from 'lucide-react';

export interface AdminAnalyticsViewProps {
  stats: AdminStats;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ stats }) => {
  const pathDistribution = [
    { name: 'Reuse', count: 48, pct: 36, color: 'bg-emerald-500', text: 'text-emerald-700', icon: <Repeat className="w-4 h-4" /> },
    { name: 'Repair', count: 28, pct: 21, color: 'bg-sky-500', text: 'text-sky-700', icon: <Wrench className="w-4 h-4" /> },
    { name: 'Upcycle', count: 24, pct: 18, color: 'bg-purple-500', text: 'text-purple-700', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Donate', count: 20, pct: 15, color: 'bg-amber-500', text: 'text-amber-700', icon: <HeartHandshake className="w-4 h-4" /> },
    { name: 'Recycle', count: 14, pct: 10, color: 'bg-blue-500', text: 'text-blue-700', icon: <Recycle className="w-4 h-4" /> },
  ];

  const categoryVolumes = [
    { category: 'Clothing & Textiles', weightKg: 342, items: 85, pct: 27 },
    { category: 'Furniture & Timber', weightKg: 468, items: 38, pct: 37 },
    { category: 'Glass Containers', weightKg: 154, items: 72, pct: 12 },
    { category: 'Consumer Electronics', weightKg: 112, items: 29, pct: 9 },
    { category: 'Metal Hardware', weightKg: 98, items: 24, pct: 8 },
    { category: 'Other & Polymers', weightKg: 74, items: 32, pct: 7 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Application Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
          Sustainability & Platform Analytics
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          Transparent metrics on circular waste diversion, greenhouse avoidance, and pathway distribution.
        </p>
      </div>

      {/* Top 3 Impact Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="bordered" className="p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-subtle font-semibold uppercase">Total Solid Waste Diverted</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-forest-900">
            {stats.totalWasteDivertedKg.toLocaleString()} <span className="text-sm font-normal text-dark-muted">kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% growth from previous month</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-subtle font-semibold uppercase">Estimated Greenhouse Gas Avoided</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-forest-900">
            {stats.totalCo2SavedKg.toLocaleString()} <span className="text-sm font-normal text-dark-muted">kg CO₂e</span>
          </div>
          <div className="text-[11px] text-sky-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Based on EPA WARM emissions factors</span>
          </div>
        </Card>

        <Card variant="bordered" className="p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-subtle font-semibold uppercase">Circular Conversion Ratio</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Recycle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-forest-900">
            78.5%
          </div>
          <div className="text-[11px] text-purple-700">
            Analyzed items successfully routed to non-landfill solutions
          </div>
        </Card>
      </div>

      {/* Two Column Graphs/Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pathway Distribution */}
        <Card variant="bordered" className="p-6 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-forest-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-forest-900">5-Path Recommendation Distribution</h3>
              <p className="text-[11px] text-dark-muted">Breakdown of recommended action pathways across analyses</p>
            </div>
            <span className="text-xs font-bold text-forest-800">134 total paths</span>
          </div>

          <div className="space-y-3.5">
            {pathDistribution.map((path) => (
              <div key={path.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={path.text}>{path.icon}</span>
                    <span className="font-semibold text-forest-900">{path.name}</span>
                  </div>
                  <div className="text-dark-muted">
                    <strong>{path.count}</strong> actions ({path.pct}%)
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-forest-100 overflow-hidden">
                  <div className={`h-full rounded-full ${path.color}`} style={{ width: `${path.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Weight Breakdown */}
        <Card variant="bordered" className="p-6 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-forest-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-forest-900">Waste Diversion by Material Category</h3>
              <p className="text-[11px] text-dark-muted">Net mass saved across primary product categories</p>
            </div>
            <span className="text-xs font-bold text-forest-800">1,248 kg diverted</span>
          </div>

          <div className="space-y-3">
            {categoryVolumes.map((item) => (
              <div
                key={item.category}
                className="p-2.5 rounded-xl border border-forest-100 bg-forest-50/20 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-forest-900 block">{item.category}</span>
                  <span className="text-[11px] text-dark-subtle">{item.items} items processed</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-forest-900 block">{item.weightKg} kg</span>
                  <span className="text-[10px] text-forest-600 font-semibold">{item.pct}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
