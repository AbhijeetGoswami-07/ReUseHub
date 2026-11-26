import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Modal } from '@/components/common/Modal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { SpotlightCard } from '@/components/common/SpotlightCard';
import { CountUp } from '@/components/common/CountUp';
import { ShinyText } from '@/components/common/ShinyText';
import { BlurText } from '@/components/common/BlurText';
import { VisualInstructionGuide } from '@/components/diy/VisualInstructionGuide';
import { INITIAL_DIY_IDEAS } from '@/services/ideasService';
import { DIYInstructionIdea } from '@/types';
import { JeansCompletedToteSvg } from '@/components/diy/svgs/JeansCompletedToteSvg';
import {
  ArrowRight,
  Sparkles,
  Shirt,
  Wine,
  Sprout,
  Armchair,
  Cpu,
  Layers,
  Wrench,
  Repeat,
  HeartHandshake,
  Recycle,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Compass,
  PackageCheck,
  Search,
  BookOpen,
} from 'lucide-react';

interface FeaturedIdea {
  id: string;
  from: string;
  to: string;
  category: string;
  action: 'reuse' | 'repair' | 'upcycle' | 'donate' | 'recycle';
  difficulty: string;
  time: string;
  co2Saved: string;
  image: string;
  description: string;
  steps: string[];
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedIdea, setSelectedIdea] = useState<FeaturedIdea | null>(null);

  // Featured Reuse Ideas requested by specification
  const featuredIdeas: FeaturedIdea[] = [
    {
      id: 'idea-tshirt',
      from: 'Old T-Shirt',
      to: 'Lint-Free Cleaning Cloths',
      category: 'Clothing',
      action: 'reuse',
      difficulty: 'Easy',
      time: '10 mins',
      co2Saved: '2.1 kg CO2e',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      description: 'Cut worn cotton shirts into lint-free microfiber alternatives perfect for kitchen countertops, car detailing, or workshop dusters.',
      steps: [
        'Cut away thick seams, collar, and hem with fabric scissors.',
        'Divide into uniform 10x10 inch squares.',
        'Wash in hot water with baking soda to maximize absorbency.',
        'Store in a dedicated basket near cleaning supplies for repeated machine washing.',
      ],
    },
    {
      id: 'idea-jeans',
      from: 'Old Jeans',
      to: 'Durable Denim Tote Bag',
      category: 'Clothing',
      action: 'upcycle',
      difficulty: 'Moderate',
      time: '1.5 hrs',
      co2Saved: '11.5 kg CO2e',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      description: 'Harness heavy-duty denim weave to stitch a lifetime-guaranteed farmer’s market bag with natural back-pocket organizers.',
      steps: [
        'Trim pant legs just below the back pockets to form the main tote body.',
        'Turn inside out and sew a double-reinforced bottom seam.',
        'Slice 2-inch strips from the leftover legs to construct sturdy shoulder straps.',
        'Attach straps to inner waistband with heavy-duty thread.',
      ],
    },
    {
      id: 'idea-jar',
      from: 'Glass Jar',
      to: 'Airtight Pantry Container',
      category: 'Glass',
      action: 'reuse',
      difficulty: 'Easy',
      time: '15 mins',
      co2Saved: '1.8 kg CO2e',
      image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=600&q=80',
      description: 'Strip commercial sticky labels cleanly and sanitize glass for non-toxic bulk food pantry storage (beans, spices, seeds).',
      steps: [
        'Soak jar in warm water and dish soap for 20 minutes to soften glue.',
        'Scrub residue with an equal mix of baking soda and cooking oil.',
        'Boil jar and metal lid for 5 minutes to sterilize.',
        'Label with grease pencil or kraft paper tape.',
      ],
    },
    {
      id: 'idea-bottle',
      from: 'Plastic Bottle',
      to: 'Self-Watering Herb Planter',
      category: 'Plastic',
      action: 'upcycle',
      difficulty: 'Easy',
      time: '20 mins',
      co2Saved: '0.9 kg CO2e',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
      description: 'Cut a 2-liter PET bottle in half and use inverted capillary cotton wicks to keep basil, mint, or thyme perfectly hydrated.',
      steps: [
        'Cut plastic bottle horizontally roughly 4 inches from the base.',
        'Invert the top neck portion inside the lower base reservoir.',
        'Thread a 6-inch cotton cord through the cap hole to act as a capillary wick.',
        'Fill top funnel with potting soil and plant your herb cuttings; fill bottom with water.',
      ],
    },
    {
      id: 'idea-pallet',
      from: 'Wooden Pallet',
      to: 'Rustic Garden Patio Furniture',
      category: 'Furniture',
      action: 'upcycle',
      difficulty: 'Advanced',
      time: '3.0 hrs',
      co2Saved: '32.0 kg CO2e',
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=80',
      description: 'Sand untreated heat-treated (HT) timber pallets, stack and secure with exterior deck screws for weather-resistant outdoor lounge benches.',
      steps: [
        'Verify pallet stamp has "HT" (Heat Treated) mark, never "MB" (chemical methyl bromide).',
        'Thoroughly sand rough planks with 80-grit then 120-grit sandpaper.',
        'Stack two pallets for seat height, and anchor a third vertically for backrest with carriage bolts.',
        'Apply natural linseed oil or exterior weather sealant and top with weatherproof cushions.',
      ],
    },
  ];

  // Section 4 Product Categories requested by specification
  const productCategories = [
    {
      name: 'Clothing',
      desc: 'Denim, cotton, wool, sportswear & fabric scraps',
      icon: Shirt,
      examples: 'Mending, insulation, tote bags',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Plastic',
      desc: 'Containers, bottles, buckets & HDPE polymers',
      icon: Layers,
      examples: 'Planters, organizers, filament',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      name: 'Electronics',
      desc: 'Smartphones, motherboards, chargers & appliances',
      icon: Cpu,
      examples: 'Component salvage, monitor hacks',
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      name: 'Furniture',
      desc: 'Chairs, desks, pallets, shelves & cabinetry',
      icon: Armchair,
      examples: 'Refinishing, structural repair',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      name: 'Glass',
      desc: 'Mason jars, wine bottles, cookware & mirrors',
      icon: Wine,
      examples: 'Airtight storage, lamps, mosaic',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    {
      name: 'Paper',
      desc: 'Cardboard boxes, magazines, newspapers & tubes',
      icon: BookOpen,
      examples: 'Sheet mulching, seed starter pots',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    {
      name: 'Metal',
      desc: 'Aluminium cans, steel drums, brass & cutlery',
      icon: Wrench,
      examples: 'Hardware repair, garden tools',
      color: 'bg-slate-50 text-slate-800 border-slate-200',
    },
    {
      name: 'Household Products',
      desc: 'Cookware, sporting goods, toys & utensils',
      icon: PackageCheck,
      examples: 'Repurposing, community swap',
      color: 'bg-lime-50 text-lime-800 border-lime-200',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* =========================================================================
          HERO SECTION (Two-Column Layout)
         ========================================================================= */}
      <section className="relative overflow-hidden py-12 lg:py-20 border-b border-brand-border bg-gradient-to-b from-brand-bg to-white/70">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/90 text-brand-primary text-xs font-bold uppercase tracking-wider border border-forest-200 shadow-soft-xs backdrop-blur-sm">
                <Sprout className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <ShinyText color="#1b4332" shineColor="#10b981" speed={2.5} className="font-bold">
                  Smarter Choices. Less Waste.
                </ShinyText>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] text-brand-primary tracking-tight leading-[1.14]">
                <BlurText text="Don't Throw It Away." duration={0.6} />{' '}
                <span className="text-brand-secondary block mt-1">
                  <ShinyText color="#2d6a4f" shineColor="#52b788" speed={3}>
                    Give It a New Purpose.
                  </ShinyText>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl">
                Discover smarter ways to reuse, repair, upcycle and donate unwanted products.
                Turn everyday waste into valuable opportunities.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link to="/analyzer">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto font-semibold shadow-soft-sm"
                    leftIcon={<Sparkles className="w-4 h-4 text-sage-200" />}
                  >
                    Analyze a Product
                  </Button>
                </Link>

                <Link to="/discover">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto font-semibold"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Reuse Ideas
                  </Button>
                </Link>
              </div>

              {/* Environmental Credibility Badge */}
              <div className="pt-4 flex items-center gap-6 text-xs text-brand-muted border-t border-brand-border/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-secondary shrink-0" />
                  <span>5-Path Recommendation Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand-secondary shrink-0" />
                  <span>Calculated CO2e Avoidance</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Editorial Composition */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* 2x2 Curated Editorial Grid */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-white/60 border border-brand-border shadow-soft-md backdrop-blur-sm">
                  {/* Item 1: Old Clothing Converted to Useful Products */}
                  <SpotlightCard
                    spotlightColor="rgba(46, 125, 79, 0.35)"
                    intensity={0.3}
                    className="group relative rounded-xl overflow-hidden bg-forest-100 border border-brand-border h-44 sm:h-52 p-0"
                  >
                    <div className="w-full h-full p-2 bg-[#FDFBF7] flex items-center justify-center">
                      <JeansCompletedToteSvg showLabels={false} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left text-white z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-primary/90">
                        Clothing &rarr; Tote Bags
                      </span>
                      <p className="text-xs font-semibold mt-1 text-white/95 truncate">
                        Torn Jeans to Heavy-Duty Tote
                      </p>
                    </div>
                  </SpotlightCard>

                  {/* Item 2: Glass Jars Reused as Storage */}
                  <SpotlightCard
                    spotlightColor="rgba(20, 184, 166, 0.35)"
                    intensity={0.3}
                    className="group relative rounded-xl overflow-hidden bg-forest-100 border border-brand-border h-44 sm:h-52 p-0"
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=600&q=80"
                      alt="Glass jars reused as pantry storage"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left text-white z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-primary/90">
                        Glass &rarr; Pantry Storage
                      </span>
                      <p className="text-xs font-semibold mt-1 text-white/95 truncate">
                        Zero-Waste Airtight Canisters
                      </p>
                    </div>
                  </SpotlightCard>

                  {/* Item 3: Plastic Bottles Converted into Planters */}
                  <SpotlightCard
                    spotlightColor="rgba(16, 185, 129, 0.35)"
                    intensity={0.3}
                    className="group relative rounded-xl overflow-hidden bg-forest-100 border border-brand-border h-44 sm:h-52 p-0"
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
                      alt="Plastic bottles converted into herb planters"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left text-white z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-primary/90">
                        Plastic &rarr; Herb Planters
                      </span>
                      <p className="text-xs font-semibold mt-1 text-white/95 truncate">
                        Self-Watering Botanical Pots
                      </p>
                    </div>
                  </SpotlightCard>

                  {/* Item 4: Recycled Furniture */}
                  <SpotlightCard
                    spotlightColor="rgba(245, 158, 11, 0.35)"
                    intensity={0.3}
                    className="group relative rounded-xl overflow-hidden bg-forest-100 border border-brand-border h-44 sm:h-52 p-0"
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=80"
                      alt="Recycled pallet and oak furniture"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left text-white z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-primary/90">
                        Timber &rarr; Recycled Furniture
                      </span>
                      <p className="text-xs font-semibold mt-1 text-white/95 truncate">
                        Artisanal Pallet Coffee Tables
                      </p>
                    </div>
                  </SpotlightCard>
                </div>

                {/* Overlaid Editorial Center Pill */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-brand-primary text-cream px-4 py-2 rounded-full shadow-soft-md text-xs font-semibold flex items-center gap-2 border border-brand-secondary/60 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5 text-sage-300" />
                  <span>Give Every Product a Second Life</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          LIVE PLATFORM IMPACT STATS (React Bits CountUp Component)
         ========================================================================= */}
      <section className="py-8 bg-brand-primary text-white border-b border-forest-800">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 p-3">
              <div className="text-3xl sm:text-4xl font-display font-black text-sage-200">
                <CountUp to={14250} separator="," suffix="+" duration={2.2} />
              </div>
              <div className="text-xs text-forest-300 uppercase tracking-wider font-semibold">
                Products Diverted
              </div>
            </div>

            <div className="space-y-1 p-3 border-l border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-display font-black text-emerald-400">
                <CountUp to={48.6} decimals={1} suffix=" t" duration={2} />
              </div>
              <div className="text-xs text-forest-300 uppercase tracking-wider font-semibold">
                CO2e Emissions Saved
              </div>
            </div>

            <div className="space-y-1 p-3 border-l border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-display font-black text-sage-200">
                <CountUp to={3820} separator="," suffix="+" duration={2.4} />
              </div>
              <div className="text-xs text-forest-300 uppercase tracking-wider font-semibold">
                Community Makers
              </div>
            </div>

            <div className="space-y-1 p-3 border-l border-forest-800/80">
              <div className="text-3xl sm:text-4xl font-display font-black text-emerald-400">
                <CountUp to={96.8} decimals={1} suffix="%" duration={1.8} />
              </div>
              <div className="text-xs text-forest-300 uppercase tracking-wider font-semibold">
                Landfill Avoidance Rate
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 2: THE PROBLEM
         ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-secondary">
              The Linear Consumption Dilemma
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary leading-tight">
              One Person's Waste Can Be Another Person's Resource.
            </h2>
            <p className="text-base text-brand-muted leading-relaxed">
              Every day, millions of functional household items, textiles, electronics, and materials are discarded simply because users do not know their alternative applications or lack accessible repair instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard
              spotlightColor="rgba(239, 68, 68, 0.18)"
              className="p-6 sm:p-7 rounded-2xl bg-white border border-brand-border space-y-3 text-left shadow-soft-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-text">
                The Discard Knowledge Gap
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Over 70% of discarded items still have functional components. Without actionable guidance, throwing items into landfills becomes the default pathway habit.
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.18)"
              className="p-6 sm:p-7 rounded-2xl bg-white border border-brand-border space-y-3 text-left shadow-soft-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-text">
                Lost Embedded Energy
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Manufacturing replacements requires raw mining, petrochemical processing, and heavy freight. Reusing an existing item eliminates 80–95% of embodied lifecycle emissions.
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.22)"
              className="p-6 sm:p-7 rounded-2xl bg-white border border-brand-border space-y-3 text-left shadow-soft-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                <Repeat className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-brand-text">
                The ReUseHub Solution
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                By bridging material diagnostics with community exchange and repair blueprints, ReUseHub turns unwanted items into zero-waste circular assets.
              </p>
            </SpotlightCard>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 3: HOW IT WORKS
         ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-brand-bg border-b border-brand-border scroll-mt-20">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-secondary">
              Four Simple Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary">
              How ReUseHub Works
            </h2>
            <p className="text-sm text-brand-muted">
              From an unwanted item in your home to a renewed circular resource in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Add Your Product',
                desc: 'Enter your item’s name, material type, and optionally upload a quick photo.',
                icon: Search,
              },
              {
                num: '02',
                title: 'Analyze Its Condition',
                desc: 'Select whether the item is like new, has minor faults, or is damaged beyond simple use.',
                icon: Wrench,
              },
              {
                num: '03',
                title: 'Discover Recommendations',
                desc: 'Review custom circular pathways across Reuse, Repair, Upcycle, Donate, and Recycle.',
                icon: Lightbulb,
              },
              {
                num: '04',
                title: 'Give It a Second Life',
                desc: 'Follow step-by-step DIY plans, visit nearby repair cafés, or list it free on our marketplace.',
                icon: Repeat,
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-2xl bg-white border border-brand-border hover:border-brand-secondary/50 shadow-soft-xs transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-extrabold text-2xl text-brand-secondary/80">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-forest-50 text-brand-primary flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-secondary" />
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-base text-brand-text">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-brand-border/60">
                    <span className="text-[11px] font-semibold text-brand-secondary inline-flex items-center gap-1">
                      Explore Step &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/analyzer">
              <Button variant="primary" size="md">
                Try the Product Analyzer Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 4: PRODUCT CATEGORIES
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-brand-border">
        <Container size="xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-secondary">
                Material & Item Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary">
                Product Categories
              </h2>
              <p className="text-sm text-brand-muted max-w-xl">
                Browse reuse and upcycling pathways tailored to specific material compositions and common household goods.
              </p>
            </div>

            <Link to="/discover">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse All Guides
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {productCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/discover?query=${encodeURIComponent(cat.name)}`)}
                  className="group p-5 rounded-2xl border border-brand-border hover:border-brand-secondary bg-white hover:bg-forest-50/40 transition-all duration-200 cursor-pointer shadow-soft-xs hover:shadow-soft-sm text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-forest-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5 text-brand-secondary group-hover:text-cream transition-colors" />
                    </div>

                    <h3 className="font-display font-bold text-base text-brand-text group-hover:text-brand-primary transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-brand-muted leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-brand-muted truncate max-w-[170px]">
                      {cat.examples}
                    </span>
                    <span className="text-brand-secondary font-semibold group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 5: FEATURED REUSE IDEAS
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-brand-bg border-b border-brand-border">
        <Container size="xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest font-bold text-brand-secondary">
              Proven Transformations
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary">
              Featured Reuse Ideas
            </h2>
            <p className="text-sm text-brand-muted">
              Step-by-step blueprints created by environmental researchers and community makers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIdeas.map((idea) => (
              <SpotlightCard
                key={idea.id}
                spotlightColor="rgba(46, 125, 79, 0.22)"
                intensity={0.25}
                className="group rounded-2xl border border-brand-border bg-white overflow-hidden shadow-soft-xs hover:shadow-soft-sm hover:border-brand-secondary/50 transition-all text-left flex flex-col justify-between p-0"
              >
                <div>
                  {/* Photo with Overlay Transformation Banner */}
                  <div className="relative h-48 w-full bg-forest-100 overflow-hidden">
                    <ImageWithFallback
                      src={idea.image}
                      alt={idea.to}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={idea.action} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-brand-primary px-2.5 py-1 rounded-full text-xs font-semibold shadow-soft-xs">
                      {idea.time}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-brand-secondary font-bold">
                      <span>{idea.from}</span>
                      <span>&rarr;</span>
                      <span className="text-brand-text">{idea.to}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-brand-primary leading-snug">
                      {idea.to}
                    </h3>

                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                      {idea.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-brand-muted border-t border-brand-border/60">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {idea.co2Saved}
                      </span>
                      <span className="capitalize">{idea.difficulty} difficulty</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    View Instructions
                  </Button>
                </div>
              </SpotlightCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/discover">
              <Button variant="secondary" size="md" rightIcon={<Compass className="w-4 h-4" />}>
                Explore All 50+ Reuse Guides
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 6: WHY REUSEHUB?
         ========================================================================= */}
      <section id="about" className="py-16 sm:py-24 bg-white border-b border-brand-border scroll-mt-20">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-secondary">
                Environmental Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-brand-primary leading-tight">
                Why ReUseHub?
              </h2>
              <p className="text-base text-brand-muted leading-relaxed">
                ReUseHub is an environmental studies software project built to accelerate the circular economy. We provide everyday consumers, students, and businesses with actionable knowledge to keep useful materials alive.
              </p>

              <div className="pt-2">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View Impact Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right 4 Pillars */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div className="p-5 rounded-2xl bg-forest-50/70 border border-brand-border space-y-2">
                <div className="w-9 h-9 rounded-xl bg-brand-primary text-cream flex items-center justify-center font-bold text-xs">
                  <Recycle className="w-5 h-5 text-sage-200" />
                </div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Reduce Waste
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Divert thousands of kilograms of municipal solid waste and hazardous e-waste from entering polluting landfills.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-forest-50/70 border border-brand-border space-y-2">
                <div className="w-9 h-9 rounded-xl bg-brand-primary text-cream flex items-center justify-center font-bold text-xs">
                  <Scale className="w-5 h-5 text-sage-200" />
                </div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Save Resources
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Conserve virgin water, metals, and timber. Every repaired or reused product eliminates unnecessary new industrial extraction.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-forest-50/70 border border-brand-border space-y-2">
                <div className="w-9 h-9 rounded-xl bg-brand-primary text-cream flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-5 h-5 text-sage-200" />
                </div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Encourage Creativity
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Learn practical DIY repair, stitching, woodworking, and electronics skills through community guides and maker workshops.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-forest-50/70 border border-brand-border space-y-2">
                <div className="w-9 h-9 rounded-xl bg-brand-primary text-cream flex items-center justify-center font-bold text-xs">
                  <HeartHandshake className="w-5 h-5 text-sage-200" />
                </div>
                <h3 className="font-display font-bold text-base text-brand-primary">
                  Sustainable Consumption
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Transform mindsets from disposal to stewardship. Connect local communities to share, trade, and donate products freely.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 7: FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-16 sm:py-24 bg-brand-primary text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-secondary/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

        <Container size="md">
          <div className="text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-sage-300 text-xs font-bold uppercase tracking-wider">
              <Sprout className="w-3.5 h-3.5" />
              <span>Start In Seconds</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
              Your Next Sustainable Decision Starts Here.
            </h2>

            <p className="text-sm sm:text-base text-forest-100 max-w-xl mx-auto leading-relaxed">
              Have an item at home you are thinking of discarding? Input its details now and discover high-impact alternatives before throwing it away.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analyzer">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-semibold px-8"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Try ReUseHub
                </Button>
              </Link>
              <Link to="/discover">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center font-semibold rounded-xl text-base px-6 py-3 h-12 border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-brand-primary transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Browse Knowledge Base
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          INSTRUCTION DETAILS MODAL FOR FEATURED IDEAS (VISUAL DIY BLUEPRINT)
         ========================================================================= */}
      {selectedIdea && (() => {
        const matchedDiyIdea: DIYInstructionIdea = INITIAL_DIY_IDEAS.find(
          (i: DIYInstructionIdea) =>
            i.id === selectedIdea.id ||
            i.beforeProduct.toLowerCase().includes(selectedIdea.from.toLowerCase()) ||
            selectedIdea.from.toLowerCase().includes(i.beforeProduct.toLowerCase())
        ) || {
          id: selectedIdea.id,
          projectTitle: `${selectedIdea.from} to ${selectedIdea.to}`,
          category: 'Clothing Upcycling',
          beforeProduct: selectedIdea.from,
          finalProduct: selectedIdea.to,
          description: selectedIdea.description,
          difficultyLevel: 'Moderate',
          estimatedCompletionTime: selectedIdea.time,
          requiredMaterials: ['Primary material: ' + selectedIdea.from, 'Fabric scissors', 'Measuring tape'],
          toolsRequired: ['Hand tools', 'Work surface'],
          safetyPrecautions: ['Work carefully with sharp tools and inspect materials before crafting.'],
          relevantImage: selectedIdea.image,
          co2SavedKg: parseFloat(selectedIdea.co2Saved) || 5.0,
          stepByStepInstructions: selectedIdea.steps.map((s, idx) => ({
            stepNumber: idx + 1,
            title: `Step ${idx + 1}: ${s.split('.')[0].slice(0, 32)}`,
            instruction: s,
            diagramType: idx === 0 ? 'cut' : idx === 1 ? 'fold' : idx === 2 ? 'stitch' : 'assemble',
          })),
        };

        return (
          <Modal
            isOpen={Boolean(selectedIdea)}
            onClose={() => setSelectedIdea(null)}
            size="2xl"
            hideHeader
          >
            <VisualInstructionGuide
              idea={matchedDiyIdea}
              onClose={() => setSelectedIdea(null)}
            />
          </Modal>
        );
      })()}
    </div>
  );
};
