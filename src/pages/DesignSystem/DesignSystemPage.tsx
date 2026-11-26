import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ImageUpload } from '@/components/common/ImageUpload';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ProductCard } from '@/components/product/ProductCard';
import { RecommendationCard } from '@/components/recommendations/RecommendationCard';
import { Modal } from '@/components/common/Modal';
import { Skeleton, CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Logo, LogoMark } from '@/components/common/Logo';
import { useToast } from '@/contexts/ToastContext';
import { MarketplaceListing, RecommendationPlan } from '@/types';
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle,
  Package,
  Layers,
  Palette,
  Eye,
  Sliders,
  Type,
  Maximize2,
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('repair');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Sample data for ProductCard
  const sampleListing: MarketplaceListing = {
    id: 'ds-product-1',
    productName: 'Vintage Solid Oak Swivel Chair',
    title: 'Vintage Solid Oak Swivel Chair',
    description: 'Heavy duty office chair with original cast iron mechanics. Smooth tilt mechanism, minor surface scuffs.',
    category: 'furniture',
    material: 'wood',
    condition: 'good',
    actionRecommendation: 'repair',
    images: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    listingType: 'Sale',
    price: 25,
    isFree: false,
    city: 'Seattle',
    state: 'WA',
    location: 'North Campus District (1.4 km)',
    sellerId: 'user-ds',
    sellerName: 'Elena Rostova',
    status: 'active',
    createdAt: '30 mins ago',
  };

  // Sample data for RecommendationCard
  const samplePlan: RecommendationPlan = {
    id: 'ds-plan-1',
    action: 'repair',
    title: 'Modular Bushing & Bolt Replacement',
    isApplicable: true,
    difficulty: 'easy',
    estimatedTimeMinutes: 35,
    environmentalImpact: {
      co2KgSaved: 16.8,
      wasteKgDiverted: 7.2,
      waterLitersSaved: 380,
    },
    summary: 'Restore pivot stability by swapping worn polyurethane bushings and applying vegetable-based dry lubricant.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Unscrew base plate fasteners using an M5 hex key.',
        toolsNeeded: ['M5 Hex Key', 'Torque Wrench'],
      },
      {
        stepNumber: 2,
        instruction: 'Insert replacement nylon dampener ring and secure bolts to 12 Nm.',
      },
    ],
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg text-brand-text">
      <Container size="xl">
        {/* Page Header */}
        <div className="mb-14 space-y-4 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold">
            <Palette className="w-3.5 h-3.5 text-brand-secondary" />
            <span>ReUseHub Design System & Visual Identity</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-brand-primary tracking-tight">
            Design Tokens & Components
          </h1>
          <p className="text-base text-brand-muted leading-relaxed">
            Coherent, accessible, and responsive components built specifically for environmental technology workflows.
          </p>
        </div>

        {/* 1. BRAND & LOGO SECTION */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Layers className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              1. Brand Identity & Logo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-4 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Full Primary Logo
              </span>
              <div className="p-4 bg-brand-bg rounded-xl flex items-center justify-center">
                <Logo variant="full" size="md" />
              </div>
              <p className="text-xs text-brand-muted">
                Combines circular renewal arrows with central living leaf.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-4 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                Compact Mark
              </span>
              <div className="p-4 bg-brand-bg rounded-xl flex items-center justify-center gap-4">
                <LogoMark size={28} className="text-brand-primary" />
                <LogoMark size={36} className="text-brand-primary" />
                <LogoMark size={48} className="text-brand-primary" />
              </div>
              <p className="text-xs text-brand-muted">
                Recognizable mark scalable from 16px to 64px+.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-primary text-white space-y-4 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage-300">
                Inverted / Dark Theme
              </span>
              <div className="p-4 bg-forest-800 rounded-xl flex items-center justify-center">
                <Logo variant="full" size="md" theme="light" />
              </div>
              <p className="text-xs text-forest-200">
                Optimized for dark headers, banners, and print material.
              </p>
            </div>
          </div>
        </section>

        {/* 2. COLOR PALETTE */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Palette className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              2. Color Palette & Semantic Tokens
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: 'Primary', hex: '#234B35', bg: 'bg-[#234B35]', text: 'text-white' },
              { name: 'Secondary', hex: '#3F7955', bg: 'bg-[#3F7955]', text: 'text-white' },
              { name: 'Accent', hex: '#A9BEA0', bg: 'bg-[#A9BEA0]', text: 'text-brand-primary' },
              { name: 'Background', hex: '#F7F6EF', bg: 'bg-[#F7F6EF]', text: 'text-brand-primary', border: true },
              { name: 'Surface', hex: '#FFFFFF', bg: 'bg-[#FFFFFF]', text: 'text-brand-primary', border: true },
              { name: 'Text', hex: '#26332B', bg: 'bg-[#26332B]', text: 'text-white' },
              { name: 'Muted', hex: '#788279', bg: 'bg-[#788279]', text: 'text-white' },
              { name: 'Border', hex: '#E3E9E0', bg: 'bg-[#E3E9E0]', text: 'text-brand-primary', border: true },
            ].map((c) => (
              <div key={c.name} className="p-3 rounded-xl bg-white border border-brand-border space-y-2 text-left">
                <div className={`h-12 w-full rounded-lg ${c.bg} ${c.border ? 'border border-brand-border' : ''}`} />
                <div>
                  <div className="text-xs font-bold text-brand-text">{c.name}</div>
                  <div className="text-[11px] font-mono text-brand-muted">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. BUTTONS & INTERACTIONS */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Sliders className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              3. Button System & Interactive States
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
                Variants (Primary, Secondary, Outline, Ghost, Danger)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4 text-sage-200" />}>
                  Primary Action
                </Button>
                <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Secondary Action
                </Button>
                <Button variant="outline">
                  Outline Action
                </Button>
                <Button variant="ghost">
                  Ghost Action
                </Button>
                <Button variant="danger">
                  Danger Action
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
                Sizes & States (sm, md, lg, Loading, Disabled)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">Small (sm)</Button>
                <Button size="md" variant="primary">Medium (md)</Button>
                <Button size="lg" variant="primary">Large (lg)</Button>
                <Button size="md" variant="primary" isLoading>Processing</Button>
                <Button size="md" variant="primary" disabled>Disabled</Button>
                <Button size="md" variant="secondary" disabled>Disabled Secondary</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FORM CONTROLS (Input, Select, ImageUpload) */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Type className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              4. Form Controls (Input, Select, Image Upload)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-4">
              <Input
                label="Standard Input"
                placeholder="Enter product title..."
                leftIcon={<Search className="w-4 h-4" />}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Subtle border (#E3E9E0) and forest green focus ring."
              />

              <Input
                label="Input With Validation Error"
                placeholder="e.g. Broken kettle"
                defaultValue="Invalid value"
                error="Please specify the primary component fault."
              />

              <Select
                label="Circular Pathway Selection"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: 'reuse', label: '1. Reuse — Direct Secondary Use' },
                  { value: 'repair', label: '2. Repair — Component Restoration' },
                  { value: 'upcycle', label: '3. Upcycle — Creative Upgrade' },
                  { value: 'donate', label: '4. Donate — Social Handoff' },
                  { value: 'recycle', label: '5. Recycle — Material Recovery' },
                ]}
                helperText="Accessible select dropdown with custom chevron and focus ring."
              />
            </div>

            <div className="p-6 rounded-2xl bg-white border border-brand-border">
              <ImageUpload
                label="Item Image Upload"
                value={uploadedImage}
                onChange={(url) => setUploadedImage(url)}
                helperText="Drag & drop or file browse with instant preview and remove controls."
              />
            </div>
          </div>
        </section>

        {/* 5. STATUS BADGES */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <CheckCircle className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              5. Action & Status Badges
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-4 text-left">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
                The 5 Core Action Badges
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status="reuse" size="md" />
                <StatusBadge status="repair" size="md" />
                <StatusBadge status="upcycle" size="md" />
                <StatusBadge status="donate" size="md" />
                <StatusBadge status="recycle" size="md" />
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
                General Lifecycle Badges
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status="active" size="sm" />
                <StatusBadge status="pending" size="sm" />
                <StatusBadge status="reserved" size="sm" />
                <StatusBadge status="completed" size="sm" />
                <StatusBadge status="verified" size="sm" />
                <StatusBadge status="draft" size="sm" />
              </div>
            </div>
          </div>
        </section>

        {/* 6. PRODUCT & RECOMMENDATION CARDS */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Package className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              6. Cards: Product Card & Recommendation Card
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block text-left">
                Marketplace Product Card
              </span>
              <ProductCard
                listing={sampleListing}
                onContact={() => toast.success(`Contacting seller for "${sampleListing.title}"`)}
                onViewDetails={() => setModalOpen(true)}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block text-left">
                Pathway Recommendation Card
              </span>
              <RecommendationCard
                plan={samplePlan}
                isPreferred={true}
                onSelect={() => toast.success(`Selected "${samplePlan.title}" for implementation`)}
              />
            </div>
          </div>
        </section>

        {/* 7. TOAST NOTIFICATIONS & MODALS */}
        <section className="mb-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Eye className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              7. Interactive Modal & Toast Notification Triggers
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-border space-y-4 text-left">
            <p className="text-sm text-brand-muted">
              Click below to test the reactive notification and modal systems:
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() => setModalOpen(true)}
                leftIcon={<Maximize2 className="w-4 h-4" />}
              >
                Open Accessible Modal
              </Button>

              <Button
                variant="secondary"
                onClick={() => toast.success('Product successfully evaluated! 18.4 kg CO2e saved.', 'Pathway Calculated')}
              >
                Trigger Success Toast
              </Button>

              <Button
                variant="outline"
                onClick={() => toast.error('Unable to connect to remote storage. Switched to offline mode.', 'Connection Notice')}
              >
                Trigger Error Toast
              </Button>

              <Button
                variant="ghost"
                onClick={() => toast.warning('Low battery replacement stock in local tool library.', 'Inventory Warning')}
              >
                Trigger Warning Toast
              </Button>
            </div>
          </div>
        </section>

        {/* 8. SKELETONS, EMPTY STATES & ERROR STATES */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3 text-left">
            <Layers className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-xl font-display font-bold text-brand-primary">
              8. States: Loading Skeletons, Empty States & Error States
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Loading Skeleton Card */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block text-left">
                Loading Skeleton
              </span>
              <div className="space-y-4">
                <CardSkeleton />
                <div className="p-4 bg-white rounded-xl border border-brand-border space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" className="w-10 h-10" />
                    <div className="space-y-1 flex-1">
                      <Skeleton variant="rounded" className="h-4 w-3/4" />
                      <Skeleton variant="rounded" className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="p-6 rounded-xl border border-brand-border bg-white flex items-center justify-center">
              <EmptyState
                title="No Products Logged Yet"
                description="Analyze your first item or browse the community library for inspiration."
                primaryAction={{
                  label: 'Analyze Item',
                  onClick: () => toast.info('Navigating to analyzer...'),
                }}
              />
            </div>

            {/* Error State */}
            <div className="p-6 rounded-xl border border-brand-border bg-white flex items-center justify-center">
              <ErrorState
                title="Search Filter Error"
                message="No circular methods matched your current query criteria."
                onRetry={() => toast.info('Reloading filter index...')}
              />
            </div>
          </div>
        </section>

        {/* Test Modal Component */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Circular Product Inspection"
          description="Detailed breakdown of mechanical parts, condition assessment, and reclamation options."
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success('Inspection recorded in your local impact log.');
                  setModalOpen(false);
                }}
              >
                Confirm Inspection
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs text-brand-text">
            <div className="p-3 rounded-lg bg-forest-50 border border-brand-border">
              <span className="font-bold block text-brand-primary">LCA Materials Log</span>
              <span>Substrate: Cast Iron & Solid Hardwood. Recyclability Grade: A+ (94%).</span>
            </div>
            <p className="text-brand-muted leading-relaxed">
              This item has been flagged for prioritized direct reuse or component repair before considering municipal recycling.
            </p>
          </div>
        </Modal>
      </Container>
    </div>
  );
};
