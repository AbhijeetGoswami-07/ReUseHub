import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/Skeleton';
import { SpotlightCard } from '@/components/common/SpotlightCard';
import { ShinyText } from '@/components/common/ShinyText';
import { VisualInstructionGuide } from '@/components/diy/VisualInstructionGuide';
import { ProjectCompletedIllustration } from '@/components/diy/StepIllustration';
import { useAuth } from '@/contexts/AuthContext';
import {
  DIYInstructionIdea,
  DIYCategory,
  DIYDifficulty,
} from '@/types';
import {
  getDIYReuseIdeas,
  getSavedIdeaIds,
  toggleSaveIdea,
} from '@/services/ideasService';
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Leaf,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  Hammer,
  Layers,
  Sparkles,
  ArrowLeftRight,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2,
  X,
} from 'lucide-react';

const CATEGORIES: DIYCategory[] = [
  'Clothing Upcycling',
  'Plastic Reuse',
  'Glass Reuse',
  'Paper Crafts',
  'Furniture Restoration',
  'Household Reuse',
  'Metal Reuse',
];

const DIFFICULTIES: DIYDifficulty[] = ['Easy', 'Moderate', 'Advanced'];

export const DiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL or defaults
  const activeCategory = (searchParams.get('category') as DIYCategory | 'All') || 'All';
  const activeDifficulty = (searchParams.get('difficulty') as DIYDifficulty | 'All') || 'All';

  const [ideas, setIdeas] = useState<DIYInstructionIdea[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showSavedOnly, setShowSavedOnly] = useState(searchParams.get('saved') === 'true');
  const [loading, setLoading] = useState(true);

  // Modal inspection state
  const [activeModalIdea, setActiveModalIdea] = useState<DIYInstructionIdea | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load ideas and favorites
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const fetchedIdeas = await getDIYReuseIdeas();
        if (isMounted) {
          setIdeas(fetchedIdeas);
          setSavedIds(getSavedIdeaIds());
        }
      } catch (err) {
        console.error('Failed to load DIY ideas:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL params
  const updateUrlFilters = (category: string, difficulty: string, query: string, saved: boolean) => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (difficulty !== 'All') params.set('difficulty', difficulty);
    if (query.trim()) params.set('q', query.trim());
    if (saved) params.set('saved', 'true');
    setSearchParams(params, { replace: true });
  };

  const handleCategorySelect = (category: DIYCategory | 'All') => {
    updateUrlFilters(category, activeDifficulty, searchQuery, showSavedOnly);
  };

  const handleDifficultySelect = (difficulty: DIYDifficulty | 'All') => {
    updateUrlFilters(activeCategory, difficulty, searchQuery, showSavedOnly);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateUrlFilters(activeCategory, activeDifficulty, value, showSavedOnly);
  };

  const handleToggleSavedOnly = () => {
    const nextSaved = !showSavedOnly;
    setShowSavedOnly(nextSaved);
    updateUrlFilters(activeCategory, activeDifficulty, searchQuery, nextSaved);
  };

  const handleToggleFavorite = async (idea: DIYInstructionIdea, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = await toggleSaveIdea(idea.id, user?.id);
    setSavedIds(getSavedIdeaIds());

    setToastMessage(
      result.isSaved
        ? `Added "${idea.projectTitle}" to your saved ideas`
        : `Removed "${idea.projectTitle}" from saved ideas`
    );
    setTimeout(() => {
      setToastMessage((prev) => (prev?.includes(idea.projectTitle) ? null : prev));
    }, 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setShowSavedOnly(false);
    setSearchParams({}, { replace: true });
  };

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // Category filter
      if (activeCategory !== 'All' && idea.category !== activeCategory) {
        return false;
      }
      // Difficulty filter
      if (activeDifficulty !== 'All' && idea.difficultyLevel !== activeDifficulty) {
        return false;
      }
      // Saved only filter
      if (showSavedOnly && !savedIds.includes(idea.id)) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = idea.projectTitle.toLowerCase().includes(q);
        const matchesBefore = idea.beforeProduct.toLowerCase().includes(q);
        const matchesFinal = idea.finalProduct.toLowerCase().includes(q);
        const matchesDesc = idea.description.toLowerCase().includes(q);
        const matchesCat = idea.category.toLowerCase().includes(q);
        const matchesMaterials = idea.requiredMaterials.some((m) => m.toLowerCase().includes(q));
        const matchesTools = idea.toolsRequired.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBefore && !matchesFinal && !matchesDesc && !matchesCat && !matchesMaterials && !matchesTools) {
          return false;
        }
      }
      return true;
    });
  }, [ideas, activeCategory, activeDifficulty, showSavedOnly, savedIds, searchQuery]);

  // Featured spotlight idea (first featured or denim tote)
  const spotlightIdea = useMemo(() => {
    return ideas.find((i) => i.isFeatured) || ideas[0] || null;
  }, [ideas]);

  const difficultyColors: Record<DIYDifficulty, { bg: string; text: string; border: string }> = {
    Easy: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Moderate: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Advanced: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  };

  return (
    <div className="py-8 sm:py-12 bg-brand-bg min-h-screen">
      <Container size="xl">
        {/* Editorial Top Bar with Quick Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/80 mb-8">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-brand-primary">Reuse Ideas & DIY Blueprints</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/recommendations">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeftRight className="w-3.5 h-3.5 text-brand-secondary" />}
                className="text-xs bg-white border-brand-border"
              >
                Return to Recommendations
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Analyze a Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Editorial Header */}
        <div className="max-w-3xl mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Maker & Upcycling Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-brand-primary tracking-tight leading-tight">
            Reuse Ideas & Step-by-Step Instructions
          </h1>

          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            Discover verified, workshop-tested blueprints to convert household waste, worn textiles, and discarded packaging into durable, beautiful everyday items.
          </p>
        </div>

        {/* Spotlight Editorial Banner (When no specific filters are applied) */}
        {!loading && spotlightIdea && activeCategory === 'All' && activeDifficulty === 'All' && !searchQuery && !showSavedOnly && (
          <SpotlightCard
            spotlightColor="rgba(46, 125, 79, 0.18)"
            className="mb-10 overflow-hidden rounded-2xl bg-white border border-brand-border shadow-soft-sm grid grid-cols-1 lg:grid-cols-12 transition-all p-0"
          >
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-0 overflow-hidden bg-[#FDFBF7] flex items-center justify-center p-3 border-r border-brand-border/60">
              <div className="w-full h-full min-h-[280px] flex items-center justify-center">
                <ProjectCompletedIllustration
                  idea={spotlightIdea}
                  className="w-full h-full max-h-[360px] object-contain drop-shadow-sm"
                  showLabels={true}
                />
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                <span className="px-2.5 py-1 rounded-md bg-brand-primary text-white text-xs font-semibold backdrop-blur-sm shadow-soft-xs flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sage-300" />
                  <ShinyText text="Featured Blueprint" color="#ffffff" shineColor="#a7f3d0" speed={3.5} className="text-white" />
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/95 text-brand-primary text-xs font-semibold border border-brand-border shadow-soft-xs">
                  {spotlightIdea.category}
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-start gap-4">
              <div className="space-y-4">
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-bg text-brand-text font-medium border border-brand-border">
                    <span className="text-brand-muted">Before:</span>
                    <strong className="text-brand-primary">{spotlightIdea.beforeProduct}</strong>
                    <ArrowRight className="w-3 h-3 text-brand-muted" />
                    <span className="text-brand-muted">Becomes:</span>
                    <strong className="text-emerald-700">{spotlightIdea.finalProduct}</strong>
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[spotlightIdea.difficultyLevel].bg} ${difficultyColors[spotlightIdea.difficultyLevel].text} ${difficultyColors[spotlightIdea.difficultyLevel].border}`}>
                    {spotlightIdea.difficultyLevel}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-brand-primary leading-snug">
                    {spotlightIdea.projectTitle}
                  </h2>
                  <p className="text-sm text-brand-muted leading-relaxed line-clamp-2">
                    {spotlightIdea.description}
                  </p>
                </div>

                {/* Key Metrics Ribbon */}
                <div className="flex flex-wrap items-center gap-4 text-xs py-2 text-brand-muted border-y border-brand-border/60">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-secondary" />
                    <span>Est. Time: <strong className="text-brand-text">{spotlightIdea.estimatedCompletionTime}</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>Avoids <strong className="font-semibold">{spotlightIdea.co2SavedKg} kg CO2e</strong></span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Hammer className="w-4 h-4 text-brand-secondary" />
                    <span>{spotlightIdea.stepByStepInstructions.length} Step-by-Step Guide</span>
                  </span>
                </div>

                {/* Materials & Tools Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                  <div className="bg-forest-50/50 rounded-xl p-3 border border-forest-100/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-brand-secondary" />
                      Required Materials ({spotlightIdea.requiredMaterials.length})
                    </span>
                    <ul className="text-xs text-brand-muted space-y-1">
                      {spotlightIdea.requiredMaterials.slice(0, 3).map((mat, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0" />
                          <span className="truncate">{mat}</span>
                        </li>
                      ))}
                      {spotlightIdea.requiredMaterials.length > 3 && (
                        <li className="text-[11px] text-brand-secondary font-medium">
                          +{spotlightIdea.requiredMaterials.length - 3} more in guide
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-forest-50/50 rounded-xl p-3 border border-forest-100/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5 text-brand-secondary" />
                      Tools Needed ({spotlightIdea.toolsRequired.length})
                    </span>
                    <ul className="text-xs text-brand-muted space-y-1">
                      {spotlightIdea.toolsRequired.slice(0, 3).map((tool, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <span className="truncate">{tool}</span>
                        </li>
                      ))}
                      {spotlightIdea.toolsRequired.length > 3 && (
                        <li className="text-[11px] text-brand-secondary font-medium">
                          +{spotlightIdea.toolsRequired.length - 3} more tools
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Quick Steps Preview */}
                {spotlightIdea.stepByStepInstructions.length > 0 && (
                  <div className="p-3 bg-brand-bg/80 rounded-xl border border-brand-border/70 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-brand-muted font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-brand-text">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Quick Steps Preview
                      </span>
                      <span>First 2 of {spotlightIdea.stepByStepInstructions.length} Steps</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {spotlightIdea.stepByStepInstructions.slice(0, 2).map((s) => (
                        <div key={s.stepNumber} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {s.stepNumber}
                          </span>
                          <p className="line-clamp-1 text-brand-muted">
                            {s.instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-brand-border/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setActiveModalIdea(spotlightIdea)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open Complete Instructions
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={(e) => handleToggleFavorite(spotlightIdea, e)}
                    className="border-brand-border bg-white text-brand-text hover:bg-brand-bg"
                    leftIcon={
                      savedIds.includes(spotlightIdea.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-brand-secondary" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-brand-muted" />
                      )
                    }
                  >
                    {savedIds.includes(spotlightIdea.id) ? 'Saved' : 'Save Idea'}
                  </Button>
                </div>

                <div className="text-xs text-brand-muted">
                  Includes full safety notes & materials checklist
                </div>
              </div>
            </div>
          </SpotlightCard>
        )}

        {/* Search, Filter & View Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-soft-sm mb-8 space-y-5">
          {/* Top row: Live Search and Saved Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search ideas, materials, or products (e.g. jeans, glass jars, pallet, bottles, planter)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-3 text-brand-muted hover:text-brand-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              variant={showSavedOnly ? 'primary' : 'outline'}
              size="md"
              onClick={handleToggleSavedOnly}
              leftIcon={
                showSavedOnly ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4 text-brand-secondary" />
                )
              }
              className={`shrink-0 text-xs sm:text-sm font-medium ${
                !showSavedOnly ? 'bg-white border-brand-border text-brand-text' : ''
              }`}
            >
              Saved Ideas ({savedIds.length})
            </Button>
          </div>

          {/* Category Chips Bar */}
          <div className="space-y-2 pt-2 border-t border-brand-border/60">
            <div className="flex items-center justify-between text-xs text-brand-muted">
              <span className="font-semibold text-brand-text flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-secondary" />
                Category Filters
              </span>
              <span>Showing {filteredIdeas.length} of {ideas.length} guides</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleCategorySelect('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === 'All'
                    ? 'bg-brand-primary text-white shadow-soft-xs font-semibold'
                    : 'bg-brand-bg text-brand-text border border-brand-border hover:bg-forest-50'
                }`}
              >
                All Categories ({ideas.length})
              </button>

              {CATEGORIES.map((cat) => {
                const count = ideas.filter((i) => i.category === cat).length;
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-primary text-white shadow-soft-xs font-semibold'
                        : 'bg-brand-bg text-brand-text border border-brand-border hover:bg-forest-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-brand-border text-brand-muted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty and Active Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-text flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-secondary" />
                Difficulty:
              </span>
              <button
                type="button"
                onClick={() => handleDifficultySelect('All')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeDifficulty === 'All'
                    ? 'bg-brand-secondary text-white font-semibold'
                    : 'bg-brand-bg text-brand-muted hover:text-brand-text'
                }`}
              >
                All
              </button>
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => handleDifficultySelect(diff)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeDifficulty === diff
                      ? 'bg-brand-secondary text-white font-semibold'
                      : 'bg-brand-bg text-brand-muted hover:text-brand-text'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {(activeCategory !== 'All' || activeDifficulty !== 'All' || searchQuery || showSavedOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-brand-muted hover:text-brand-primary"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Ideas Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => {
              const isSaved = savedIds.includes(idea.id);
              return (
                <SpotlightCard
                  key={idea.id}
                  spotlightColor="rgba(46, 125, 79, 0.12)"
                  className="bg-white flex flex-col justify-between overflow-hidden group border-brand-border p-0 rounded-2xl shadow-soft-xs hover:shadow-soft-md transition-all duration-300"
                >
                  {/* Visual Header: 2D Technical Blueprint Illustration */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#FDFBF7] p-2 flex items-center justify-center border-b border-brand-border/60">
                    <ProjectCompletedIllustration
                      idea={idea}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      showLabels={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                    {/* Bookmark action */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(idea, e)}
                      aria-label={isSaved ? 'Remove from saved' : 'Save idea'}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-brand-text flex items-center justify-center shadow-soft-sm transition-all z-10"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-brand-secondary fill-brand-secondary" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-brand-muted hover:text-brand-secondary" />
                      )}
                    </button>

                    {/* Transformation pill on image bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white z-10">
                      <div className="flex items-center gap-1.5 font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md truncate">
                        <span className="text-white/90">{idea.beforeProduct}</span>
                        <ChevronRight className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300 font-semibold truncate">{idea.finalProduct}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Meta badges: Category + Difficulty + Time + CO2 */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-forest-50 text-brand-primary border border-forest-200">
                            {idea.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-medium border text-[10px] ${difficultyColors[idea.difficultyLevel].bg} ${difficultyColors[idea.difficultyLevel].text} ${difficultyColors[idea.difficultyLevel].border}`}>
                            {idea.difficultyLevel}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-brand-muted text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-brand-secondary" />
                            {idea.estimatedCompletionTime}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                            {idea.co2SavedKg} kg CO2e
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-lg text-brand-primary leading-snug group-hover:text-brand-secondary transition-colors line-clamp-2">
                        {idea.projectTitle}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-brand-muted line-clamp-2 leading-relaxed">
                        {idea.description}
                      </p>

                      {/* Materials Preview */}
                      <div className="pt-2 text-xs text-brand-muted space-y-1">
                        <div className="flex items-center gap-1 font-semibold text-brand-text">
                          <Layers className="w-3 h-3 text-brand-secondary" />
                          <span>Materials Needed ({idea.requiredMaterials.length}):</span>
                        </div>
                        <p className="text-[11px] text-brand-muted line-clamp-1 italic">
                          {idea.requiredMaterials.slice(0, 2).join(', ')}
                          {idea.requiredMaterials.length > 2 ? ` +${idea.requiredMaterials.length - 2} more` : ''}
                        </p>
                      </div>

                      {/* Safety note notice if available */}
                      {idea.safetyPrecautions.length > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">Includes safety precautions</span>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="pt-4 border-t border-brand-border/60">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveModalIdea(idea)}
                        className="w-full text-xs font-semibold justify-between bg-brand-bg/50 hover:bg-forest-50 border-brand-border text-brand-primary"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 text-brand-secondary" />}
                      >
                        Open Complete Instructions
                      </Button>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}

        {/* Empty Search/Filter State */}
        {!loading && filteredIdeas.length === 0 && (
          <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-soft-sm text-center">
            <EmptyState
              icon={BookOpen}
              title={showSavedOnly ? 'No saved ideas match your criteria' : 'No reuse blueprints found'}
              description={
                showSavedOnly
                  ? 'You have not saved any ideas in this category yet. Click the bookmark icon on any guide card to save it for quick reference.'
                  : `We could not find any guides matching "${searchQuery || activeCategory}". Try searching for broader terms like "jeans", "glass", "plastic", or "boxes".`
              }
              primaryAction={{
                label: 'Reset Filters & Search',
                onClick: handleResetFilters,
              }}
              secondaryAction={{
                label: 'Analyze a New Product',
                onClick: () => {
                  window.location.href = '/analyzer';
                },
              }}
            />
          </div>
        )}
      </Container>

      {/* Complete Visual DIY Instructions Guide Modal */}
      {activeModalIdea && (
        <Modal
          isOpen={Boolean(activeModalIdea)}
          onClose={() => setActiveModalIdea(null)}
          size="2xl"
          hideHeader
        >
          <VisualInstructionGuide
            idea={activeModalIdea}
            onClose={() => setActiveModalIdea(null)}
          />
        </Modal>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-primary text-white px-4 py-3 rounded-xl shadow-soft-lg flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
