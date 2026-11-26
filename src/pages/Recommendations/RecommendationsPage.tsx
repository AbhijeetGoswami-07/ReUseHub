import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ReuseAction, ProductItem, RecommendationPlan } from '@/types';
import {
  generateRecommendations,
  saveRecommendationsToDatabase,
  AnalysisResult,
} from '@/services/recommendationEngine';
import { SAMPLE_PRODUCTS } from '@/services/sampleProducts';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  Leaf,
  MapPin,
  Bookmark,
  Sparkles,
  Store,
  Clock,
  Wrench,
  Repeat,
  HeartHandshake,
  Recycle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sliders,
  BookOpen,
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuth();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeAction, setActiveAction] = useState<ReuseAction>('reuse');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);

  // Load from session storage, sample products, or URL query parameters
  useEffect(() => {
    const sampleId = searchParams.get('sample');
    if (sampleId) {
      const match = SAMPLE_PRODUCTS.find((p) => p.id === sampleId);
      if (match) {
        const calculated = generateRecommendations(match);
        setAnalysis(calculated);
        setActiveAction(calculated.recommendedAction);
        setIsSaved(false);
        return;
      }
    }

    const cached = sessionStorage.getItem('reusehub_latest_analysis');
    if (cached) {
      try {
        const parsed: AnalysisResult = JSON.parse(cached);
        // Verify if title matches query
        const paramTitle = searchParams.get('title');
        if (!paramTitle || parsed.product.title.toLowerCase() === paramTitle.toLowerCase()) {
          setAnalysis(parsed);
          setActiveAction(parsed.recommendedAction);
          return;
        }
      } catch (err) {
        console.warn('Cache read error:', err);
      }
    }

    // Dynamic fallback from query params
    const title = searchParams.get('title') || 'Old Cotton T-Shirt';
    const category = (searchParams.get('category') as any) || 'clothing';
    const condition = (searchParams.get('condition') as any) || 'good';
    const material = (searchParams.get('material') as any) || 'cotton';

    const fallbackProduct: ProductItem = {
      id: searchParams.get('id') || `prod-${Date.now()}`,
      title,
      category,
      condition,
      material,
      description: 'Submitted for circular evaluation.',
      createdAt: new Date().toISOString(),
    };

    const calculated = generateRecommendations(fallbackProduct);
    setAnalysis(calculated);
    setActiveAction(calculated.recommendedAction);
  }, [searchParams]);

  if (!analysis) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-brand-muted">Computing circular recommendations...</p>
      </div>
    );
  }

  const { product, recommendedAction, actionPlans, applicablePlans, inapplicablePlans, analysisSummary, safetySummary } = analysis;
  const currentPlan: RecommendationPlan = actionPlans[activeAction] || actionPlans[recommendedAction];

  // Save Idea to database / localStorage
  const handleSaveIdea = async () => {
    setIsSaving(true);
    const result = await saveRecommendationsToDatabase(analysis, user?.id);
    setIsSaving(false);

    if (result.success) {
      setIsSaved(true);
      toast.success(
        `"${currentPlan.title}" saved to your personal circular plans.`,
        'Idea Bookmarked'
      );
    } else {
      toast.error('Unable to save recommendation plan. Try again.');
    }
  };

  const actionIcons: Record<ReuseAction, React.ComponentType<{ className?: string }>> = {
    reuse: Repeat,
    repair: Wrench,
    upcycle: Sparkles,
    donate: HeartHandshake,
    recycle: Recycle,
  };

  return (
    <div className="py-10 md:py-16 bg-brand-bg text-brand-text">
      <Container size="xl">
        {/* Top 15-Samples Quick Switcher Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-brand-border shadow-soft-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-secondary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Test Sample Products ({SAMPLE_PRODUCTS.length} Available):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {SAMPLE_PRODUCTS.slice(0, 8).map((sample) => {
              const isCurrent = product.title.toLowerCase() === sample.title.toLowerCase();
              return (
                <button
                  key={sample.id}
                  onClick={() => setSearchParams({ sample: sample.id })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-brand-primary text-white font-bold border-brand-primary'
                      : 'bg-forest-50/70 text-brand-muted hover:text-brand-primary border-brand-border hover:bg-forest-100'
                  }`}
                >
                  {sample.title.split(' ')[0]} {sample.title.split(' ')[1] || ''}
                </button>
              );
            })}
            <select
              onChange={(e) => {
                if (e.target.value) setSearchParams({ sample: e.target.value });
              }}
              value=""
              className="text-[11px] px-2 py-1 rounded-lg border border-brand-border bg-white text-brand-primary font-semibold cursor-pointer"
            >
              <option value="" disabled>More samples...</option>
              {SAMPLE_PRODUCTS.slice(8).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.condition.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Navigation Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-left">
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Analyze Another Product</span>
          </Link>

          {/* Core Prompt Buttons: Save Idea, Analyze Another Product, View Instructions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveIdea}
              isLoading={isSaving}
              leftIcon={<Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-brand-primary text-brand-primary' : ''}`} />}
            >
              {isSaved ? 'Idea Saved' : 'Save Idea'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setInstructionsModalOpen(true)}
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
            >
              View Instructions
            </Button>

            <Link to="/analyzer">
              <Button variant="primary" size="sm">
                Analyze Another Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Product Overview Card */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-soft-sm mb-8 text-left space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
              {/* Product Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-brand-border shadow-soft-xs shrink-0 bg-forest-50">
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Attributes */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-forest-100 px-2.5 py-0.5 rounded-full">
                    Category: {product.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-brand-muted bg-brand-bg px-2.5 py-0.5 rounded-full border border-brand-border capitalize">
                    Material: {product.material.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-brand-muted bg-brand-bg px-2.5 py-0.5 rounded-full border border-brand-border capitalize">
                    Condition: {product.condition.replace('_', ' ')}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-primary">
                  {product.title}
                </h1>

                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-2xl">
                  {analysisSummary}
                </p>

                {/* Safety Advisory Banner */}
                <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-brand-secondary">
                  <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0" />
                  <span>{safetySummary}</span>
                </div>
              </div>
            </div>

            {/* Marketplace Shortcut */}
            <div className="shrink-0 flex sm:flex-col gap-2">
              <Link to={`/marketplace?prefill=${encodeURIComponent(product.title)}`}>
                <Button variant="outline" size="sm" leftIcon={<Store className="w-3.5 h-3.5" />}>
                  List on Marketplace
                </Button>
              </Link>
            </div>
          </div>

          {/* Ranking & Recommendation Categories Selector */}
          <div className="pt-6 border-t border-brand-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Recommendation Ranking (Safety • Condition • Feasibility • Ecological Value):
              </span>
              <span className="text-[11px] text-brand-muted hidden sm:inline">
                Most suitable recommendation shown first
              </span>
            </div>

            {/* Category Buttons (5 Categories) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(['reuse', 'repair', 'upcycle', 'donate', 'recycle'] as ReuseAction[]).map((action) => {
                const plan = actionPlans[action];
                const isActive = activeAction === action;
                const isTop = recommendedAction === action;
                const Icon = actionIcons[action];

                return (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setActiveAction(action)}
                    className={`relative p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 select-none ${
                      isActive
                        ? 'border-brand-primary bg-brand-primary text-white shadow-soft-sm font-bold ring-1 ring-brand-primary'
                        : plan.isApplicable
                        ? 'border-brand-border bg-brand-bg hover:bg-forest-100/60 text-brand-text'
                        : 'border-red-200/60 bg-red-50/30 text-brand-muted/70 opacity-70'
                    }`}
                  >
                    {isTop && (
                      <span
                        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-soft-xs ${
                          isActive
                            ? 'bg-amber-400 text-brand-primary'
                            : 'bg-brand-primary text-white'
                        }`}
                      >
                        #1 Ranked
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sage-200' : plan.isApplicable ? 'text-brand-secondary' : 'text-red-400'}`} />
                      <span className="text-xs uppercase tracking-wider">{action}</span>
                    </div>

                    <span className="text-[10px] truncate max-w-full font-normal">
                      {plan.isApplicable ? `Score: ${plan.rankScore}/100` : 'Not Applicable'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Recommendation Result Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Main Plan & Instructions (Left Col) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-brand-border bg-white p-6 sm:p-8 shadow-soft-sm space-y-6">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={currentPlan.action} size="lg" />
                  {currentPlan.isApplicable && (
                    <span className="text-xs font-semibold text-brand-muted bg-forest-50 px-2.5 py-1 rounded-full border border-brand-border flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                      Estimated Effort: {currentPlan.estimatedEffort || `${currentPlan.estimatedTimeMinutes} mins`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest-100 text-brand-primary">
                    Difficulty: {currentPlan.difficulty}
                  </span>
                  {currentPlan.rankPosition && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sage-100 text-brand-primary">
                      Rank #{currentPlan.rankPosition}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Summary */}
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-primary mb-2">
                  {currentPlan.title}
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {currentPlan.summary}
                </p>
              </div>

              {/* Inapplicable Notice if this option was filtered out */}
              {!currentPlan.isApplicable && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Why this pathway is not recommended for this product:</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {currentPlan.inapplicableReason || 'Item properties or condition make this action impractical or structurally unsafe.'}
                  </p>
                </div>
              )}

              {/* Safety Notes (Explicit Requirement) */}
              {currentPlan.safetyNotes && (
                <div className="p-4 rounded-2xl bg-forest-50/80 border border-brand-border text-xs text-brand-text space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-brand-primary">
                    <ShieldAlert className="w-4 h-4 text-brand-secondary" />
                    <span>Safety Advisory & Best Practices:</span>
                  </div>
                  <p className="text-[11px] text-brand-muted leading-relaxed">
                    {currentPlan.safetyNotes}
                  </p>
                </div>
              )}

              {/* Required Materials (Explicit Requirement) */}
              {currentPlan.requiredMaterials && currentPlan.requiredMaterials.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Required Materials & Tools:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPlan.requiredMaterials.map((mat) => (
                      <span
                        key={mat}
                        className="text-xs font-medium px-3 py-1 rounded-xl bg-forest-50 border border-brand-border text-brand-text"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Instructions (Explicit Requirement) */}
              {currentPlan.steps && currentPlan.steps.length > 0 && (
                <div className="pt-4 border-t border-brand-border space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary">
                    Step-by-Step Implementation Instructions
                  </h3>

                  <div className="space-y-3.5">
                    {currentPlan.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-forest-50/50 border border-brand-border/80"
                      >
                        <div className="w-7 h-7 rounded-xl bg-brand-primary text-cream flex items-center justify-center text-xs font-bold shrink-0">
                          {step.stepNumber}
                        </div>
                        <div className="space-y-1.5 flex-1 text-xs">
                          <p className="font-medium text-brand-text leading-relaxed">
                            {step.instruction}
                          </p>
                          {step.toolsNeeded && (
                            <div className="flex items-center gap-1.5 text-brand-secondary">
                              <span className="font-semibold">Tools:</span>
                              <span>{step.toolsNeeded.join(', ')}</span>
                            </div>
                          )}
                          {step.safetyTip && (
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                              Safety Tip: {step.safetyTip}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleSaveIdea}
                  isLoading={isSaving}
                  leftIcon={<Bookmark className="w-4 h-4" />}
                >
                  {isSaved ? 'Idea Saved' : 'Save Idea'}
                </Button>

                <Link to="/analyzer">
                  <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Analyze Another Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Col: Carbon Footprint & Ranking Hierarchy */}
          <div className="lg:col-span-4 space-y-6">
            {/* Impact Calculation */}
            <div className="rounded-3xl border border-brand-border bg-brand-primary text-cream p-6 shadow-soft-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sage-300 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-sage-300" />
                Audited Carbon & Landfill Avoidance
              </span>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-forest-800/80 border border-forest-700">
                  <div className="text-2xl font-display font-extrabold text-white">
                    {currentPlan.environmentalImpact.co2KgSaved} kg CO2e
                  </div>
                  <div className="text-[11px] text-forest-200 mt-0.5">
                    Avoided Manufacturing & Transport Emissions
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-forest-800/80 border border-forest-700">
                  <div className="text-2xl font-display font-extrabold text-white">
                    {currentPlan.environmentalImpact.wasteKgDiverted} kg Mass
                  </div>
                  <div className="text-[11px] text-forest-200 mt-0.5">
                    Solid Waste Kept Out of Landfills
                  </div>
                </div>

                {currentPlan.environmentalImpact.waterLitersSaved && (
                  <div className="p-3.5 rounded-xl bg-forest-800/80 border border-forest-700">
                    <div className="text-2xl font-display font-extrabold text-white">
                      {currentPlan.environmentalImpact.waterLitersSaved} L
                    </div>
                    <div className="text-[11px] text-forest-200 mt-0.5">
                      Embedded Clean Water Conserved
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Applicable Ranked Order List */}
            <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-soft-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Circular Hierarchy Ranking
              </h4>
              <div className="space-y-2 text-xs">
                {applicablePlans.map((p, idx) => (
                  <button
                    key={p.action}
                    type="button"
                    onClick={() => setActiveAction(p.action)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                      activeAction === p.action
                        ? 'border-brand-primary bg-forest-50 font-bold text-brand-primary'
                        : 'border-brand-border hover:bg-forest-50/50 text-brand-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-forest-100 flex items-center justify-center font-bold text-[10px] text-brand-primary">
                        {idx + 1}
                      </span>
                      <span className="capitalize">{p.action}</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-brand-secondary">
                      Score: {p.rankScore}/100
                    </span>
                  </button>
                ))}
              </div>

              {inapplicablePlans.length > 0 && (
                <div className="pt-3 mt-3 border-t border-brand-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                    Inapplicable / Filtered Out:
                  </span>
                  {inapplicablePlans.map((p) => (
                    <button
                      key={p.action}
                      type="button"
                      onClick={() => setActiveAction(p.action)}
                      className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition-colors text-[11px] ${
                        activeAction === p.action
                          ? 'border-red-300 bg-red-50 text-red-900 font-semibold'
                          : 'border-brand-border/60 bg-forest-50/40 text-brand-muted hover:bg-forest-50'
                      }`}
                    >
                      <span className="capitalize line-through opacity-70">{p.action}</span>
                      <span className="text-[9px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        Not Recommended
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nearby Community Hubs */}
            {currentPlan.nearbyOptions && currentPlan.nearbyOptions.length > 0 && (
              <div className="rounded-3xl border border-brand-border bg-white p-6 shadow-soft-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Nearby Community Hubs
                  </h4>
                  <MapPin className="w-4 h-4 text-brand-secondary" />
                </div>

                <div className="space-y-2">
                  {currentPlan.nearbyOptions.map((opt) => (
                    <div
                      key={opt.name}
                      className="p-3 rounded-xl border border-brand-border hover:border-brand-secondary/60 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-brand-text">{opt.name}</p>
                        <p className="text-brand-muted capitalize text-[11px]">
                          {opt.type.replace('_', ' ')}
                        </p>
                      </div>
                      <span className="font-mono text-brand-secondary font-bold">
                        {opt.distanceKm} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Instructions Modal (from "View Instructions" button) */}
      <Modal
        isOpen={instructionsModalOpen}
        onClose={() => setInstructionsModalOpen(false)}
        title={`DIY Instructions: ${currentPlan.title}`}
        description={`Action: ${currentPlan.action.toUpperCase()} • Difficulty: ${currentPlan.difficulty} • Effort: ${currentPlan.estimatedEffort || '15 mins'}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setInstructionsModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                handleSaveIdea();
                setInstructionsModalOpen(false);
              }}
            >
              Save Idea
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left text-xs text-brand-text">
          {currentPlan.safetyNotes && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-0.5">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                Safety Notes
              </span>
              <p className="text-[11px] leading-relaxed">{currentPlan.safetyNotes}</p>
            </div>
          )}

          {currentPlan.requiredMaterials && currentPlan.requiredMaterials.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-brand-primary block">
                Required Materials & Tools:
              </span>
              <p className="text-brand-muted">{currentPlan.requiredMaterials.join(' • ')}</p>
            </div>
          )}

          <div className="space-y-3 pt-2 border-t border-brand-border">
            <span className="font-bold uppercase tracking-wider text-brand-primary block">
              Step-by-Step Instructions:
            </span>
            <div className="space-y-2.5">
              {currentPlan.steps.map((s) => (
                <div key={s.stepNumber} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-forest-100 text-brand-primary font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {s.stepNumber}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{s.instruction}</p>
                    {s.safetyTip && <p className="text-amber-800 text-[10px] mt-0.5">Tip: {s.safetyTip}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
