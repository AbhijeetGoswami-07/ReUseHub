import React, { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { UserAnalyzedProduct } from '@/services/dashboardService';
import { ReuseAction } from '@/types';
import {
  Cpu,
  Search,
  Eye,
  Sparkles,
  Layers,
  Recycle,
  Wrench,
  HeartHandshake,
  Repeat,
} from 'lucide-react';

export interface AdminAnalysesViewProps {
  analyses: UserAnalyzedProduct[];
}

export const AdminAnalysesView: React.FC<AdminAnalysesViewProps> = ({ analyses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<UserAnalyzedProduct | null>(null);

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesAction = actionFilter === 'all' || item.recommendedAction === actionFilter;

      return matchesSearch && matchesCat && matchesAction;
    });
  }, [analyses, searchQuery, categoryFilter, actionFilter]);

  const actionBadge = (action: ReuseAction) => {
    switch (action) {
      case 'reuse':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <Repeat className="w-3 h-3 text-emerald-600" /> Reuse
          </span>
        );
      case 'repair':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">
            <Wrench className="w-3 h-3 text-sky-600" /> Repair
          </span>
        );
      case 'upcycle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
            <Sparkles className="w-3 h-3 text-purple-600" /> Upcycle
          </span>
        );
      case 'donate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
            <HeartHandshake className="w-3 h-3 text-amber-600" /> Donate
          </span>
        );
      case 'recycle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
            <Recycle className="w-3 h-3 text-blue-600" /> Recycle
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-forest-100 text-forest-800">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Product Analyzer Log</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
          Product Analyses Registry ({analyses.length})
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          Review all unwanted products processed by the 5-path recommendation engine.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="bordered" className="p-4 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-forest-50/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="clothing">Clothing</option>
              <option value="plastic">Plastic</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="glass">Glass</option>
              <option value="paper">Paper</option>
              <option value="metal">Metal</option>
              <option value="household">Household</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Paths</option>
              <option value="reuse">Reuse</option>
              <option value="repair">Repair</option>
              <option value="upcycle">Upcycle</option>
              <option value="donate">Donate</option>
              <option value="recycle">Recycle</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Analyses Table */}
      <Card variant="bordered" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-50/60 border-b border-forest-100 text-forest-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Primary Path</th>
                <th className="py-3 px-4">CO₂ Avoided</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-dark-muted">
                    No analyses match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-forest-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-forest-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-forest-100 text-forest-700 flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-semibold text-forest-900">{item.title}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-dark-muted capitalize">{item.category}</td>
                    <td className="py-3 px-4 text-dark-muted capitalize">{item.material || 'Mixed'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest-50 border border-forest-100 capitalize">
                        {item.condition.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">{actionBadge(item.recommendedAction)}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">
                      {item.co2EstimateKg} kg
                    </td>
                    <td className="py-3 px-4 text-dark-subtle text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] px-2 py-1 h-7"
                        onClick={() => setSelectedProduct(item)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analysis Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Product Lifecycle Assessment"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-forest-50/40 border border-forest-100">
              {selectedProduct.imageUrl && (
                <ImageWithFallback
                  src={selectedProduct.imageUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-forest-200"
                />
              )}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-forest-900">{selectedProduct.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-dark-muted">
                  <span className="capitalize">Category: {selectedProduct.category}</span>
                  <span>•</span>
                  <span className="capitalize">Material: {selectedProduct.material || 'Mixed'}</span>
                  <span>•</span>
                  <span className="capitalize">Condition: {selectedProduct.condition}</span>
                </div>
                <div className="pt-1">{actionBadge(selectedProduct.recommendedAction)}</div>
              </div>
            </div>

            {selectedProduct.description && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-forest-900 uppercase">User Description</span>
                <p className="text-xs text-dark-muted leading-relaxed bg-white p-3 rounded-xl border border-forest-100">
                  {selectedProduct.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-semibold block">CO₂ Diversion Value</span>
                <span className="text-lg font-bold text-emerald-900">{selectedProduct.co2EstimateKg} kg CO₂e</span>
              </div>
              <div className="p-3 rounded-xl bg-forest-50 border border-forest-100">
                <span className="text-[11px] text-forest-800 font-semibold block">Processed Timestamp</span>
                <span className="text-xs font-semibold text-forest-900">
                  {new Date(selectedProduct.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
