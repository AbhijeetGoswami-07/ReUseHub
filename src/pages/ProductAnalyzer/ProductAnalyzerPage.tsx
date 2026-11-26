import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ImageUpload } from '@/components/common/ImageUpload';
import { ProductMaterial, ProductItem } from '@/types';
import { generateRecommendations } from '@/services/recommendationEngine';
import {
  analyzeProductImage,
  AIProductRecognition,
} from '@/services/aiImageRecognition';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import {
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Cpu,
  Armchair,
  Shirt,
  Wine,
  Layers,
  BookOpen,
  Wrench,
  PackageCheck,
  HelpCircle,
  ShieldCheck,
  Eye,
  AlertTriangle,
  SlidersHorizontal,
} from 'lucide-react';

type AnalyzerCategory =
  | 'clothing'
  | 'plastic'
  | 'electronics'
  | 'furniture'
  | 'glass'
  | 'paper'
  | 'metal'
  | 'household_items'
  | 'other';

type AnalyzerCondition =
  | 'like_new'
  | 'good'
  | 'needs_repair'
  | 'damaged'
  | 'unusable';

const analyzerSchema = z.object({
  title: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  category: z.enum([
    'clothing',
    'plastic',
    'electronics',
    'furniture',
    'glass',
    'paper',
    'metal',
    'household_items',
    'other',
  ]),
  material: z.enum([
    'cotton',
    'plastic',
    'wood',
    'glass',
    'metal',
    'paper',
    'leather',
    'electronic_components',
    'mixed_material',
    'unknown',
  ]),
  condition: z.enum([
    'like_new',
    'good',
    'needs_repair',
    'damaged',
    'unusable',
  ]),
  description: z
    .string()
    .min(5, 'Please provide a brief description (at least 5 characters)')
    .max(500, 'Description cannot exceed 500 characters'),
  imageUrl: z.string().optional().nullable(),
});

type AnalyzerFormData = z.infer<typeof analyzerSchema>;

const CATEGORY_DEFAULT_MATERIAL: Record<AnalyzerCategory, AnalyzerFormData['material']> = {
  clothing: 'cotton',
  plastic: 'plastic',
  electronics: 'electronic_components',
  furniture: 'wood',
  glass: 'glass',
  paper: 'paper',
  metal: 'metal',
  household_items: 'mixed_material',
  other: 'mixed_material',
};

export const ProductAnalyzerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanningAI, setIsScanningAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIProductRecognition | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  // Initial category & query detection
  const initialTitle = searchParams.get('query') || searchParams.get('title') || '';
  const paramCat = searchParams.get('category') as AnalyzerCategory | null;
  const initialCategory: AnalyzerCategory =
    paramCat &&
    ['clothing', 'plastic', 'electronics', 'furniture', 'glass', 'paper', 'metal', 'household_items', 'other'].includes(
      paramCat
    )
      ? paramCat
      : 'electronics';

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AnalyzerFormData>({
    resolver: zodResolver(analyzerSchema),
    defaultValues: {
      title: initialTitle,
      category: initialCategory,
      material: CATEGORY_DEFAULT_MATERIAL[initialCategory] || 'electronic_components',
      condition: 'good',
      description: '',
      imageUrl: null,
    },
  });

  const selectedCategory = watch('category');
  const selectedCondition = watch('condition');
  const selectedMaterial = watch('material');
  const currentImageUrl = watch('imageUrl');
  const currentTitle = watch('title');

  // Category Options
  const categoryOptions: {
    id: AnalyzerCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'plastic', label: 'Plastic', icon: Layers },
    { id: 'electronics', label: 'Electronics', icon: Cpu },
    { id: 'furniture', label: 'Furniture', icon: Armchair },
    { id: 'glass', label: 'Glass', icon: Wine },
    { id: 'paper', label: 'Paper', icon: BookOpen },
    { id: 'metal', label: 'Metal', icon: Wrench },
    { id: 'household_items', label: 'Household Items', icon: PackageCheck },
    { id: 'other', label: 'Other', icon: HelpCircle },
  ];

  // Material Options
  const materialOptions: { value: ProductMaterial; label: string }[] = [
    { value: 'cotton', label: 'Cotton / Natural Fiber' },
    { value: 'plastic', label: 'Plastic / Polymer' },
    { value: 'wood', label: 'Wood / Timber' },
    { value: 'glass', label: 'Glass' },
    { value: 'metal', label: 'Metal / Alloy' },
    { value: 'paper', label: 'Paper / Cardboard' },
    { value: 'leather', label: 'Leather' },
    { value: 'electronic_components', label: 'Electronic Components / PCB' },
    { value: 'mixed_material', label: 'Mixed Material' },
    { value: 'unknown', label: 'Unknown' },
  ];

  // Priority Materials Map per Category
  const CATEGORY_PRIORITY_MATERIALS: Record<AnalyzerCategory, ProductMaterial[]> = {
    electronics: ['electronic_components', 'metal', 'plastic', 'mixed_material', 'unknown'],
    clothing: ['cotton', 'leather', 'mixed_material', 'unknown'],
    plastic: ['plastic', 'mixed_material', 'unknown'],
    furniture: ['wood', 'metal', 'leather', 'cotton', 'plastic', 'mixed_material', 'unknown'],
    glass: ['glass', 'mixed_material', 'unknown'],
    paper: ['paper', 'mixed_material', 'unknown'],
    metal: ['metal', 'mixed_material', 'unknown'],
    household_items: ['plastic', 'metal', 'wood', 'glass', 'cotton', 'mixed_material', 'unknown'],
    other: ['mixed_material', 'plastic', 'metal', 'wood', 'glass', 'paper', 'cotton', 'leather', 'electronic_components', 'unknown'],
  };

  // Get prioritized and contextualized material options for current category
  const dynamicMaterialOptions = React.useMemo(() => {
    const preferred = CATEGORY_PRIORITY_MATERIALS[selectedCategory] || [];
    const preferredSet = new Set(preferred);
    return [
      ...materialOptions.filter((m) => preferredSet.has(m.value)),
      ...materialOptions.filter((m) => !preferredSet.has(m.value)),
    ];
  }, [selectedCategory, materialOptions]);

  // Synchronize material whenever category switches
  React.useEffect(() => {
    if (selectedCategory && CATEGORY_DEFAULT_MATERIAL[selectedCategory]) {
      const validMaterials = CATEGORY_PRIORITY_MATERIALS[selectedCategory] || [];
      if (!validMaterials.includes(selectedMaterial)) {
        setValue('material', CATEGORY_DEFAULT_MATERIAL[selectedCategory], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [selectedCategory, selectedMaterial, setValue]);

  // Condition Options
  const conditionOptions: {
    id: AnalyzerCondition;
    label: string;
    description: string;
  }[] = [
    {
      id: 'like_new',
      label: 'Like New',
      description: 'Fully functional, pristine condition with zero cosmetic or mechanical flaws.',
    },
    {
      id: 'good',
      label: 'Good',
      description: 'Functions normally with standard superficial signs of prior gentle use.',
    },
    {
      id: 'needs_repair',
      label: 'Needs Repair',
      description: 'Has a specific defect (loose joint, torn seam, frayed cord) that can be fixed.',
    },
    {
      id: 'damaged',
      label: 'Damaged',
      description: 'Major functional impairment; best suited for creative upcycling or modular parts.',
    },
    {
      id: 'unusable',
      label: 'Unusable',
      description: 'Beyond safe restoration; prime candidate for clean material separation and recycling.',
    },
  ];

  // Trigger optional AI Image Recognition
  const handleTriggerAI = async () => {
    if (!currentImageUrl) {
      toast.info('Please upload an image first to run vision identification.');
      return;
    }

    setIsScanningAI(true);
    setAiNotice(null);

    try {
      const response = await analyzeProductImage(currentImageUrl, true, currentTitle);
      setIsScanningAI(false);

      if (response.success && response.data) {
        setAiResult(response.data);
        if (response.unconfiguredNotice) {
          setAiNotice(response.unconfiguredNotice);
        }
        toast.success(
          `Identified "${response.data.product_name}" with ${(response.data.confidence * 100).toFixed(0)}% confidence. Review or apply details below.`,
          'AI Recognition Complete'
        );
      } else {
        toast.error(response.error || 'AI image recognition is currently unavailable.', 'Recognition Unavailable');
        if (response.unconfiguredNotice) {
          setAiNotice(response.unconfiguredNotice);
        }
      }
    } catch (err: any) {
      setIsScanningAI(false);
      toast.error('An error occurred during image processing.', 'Error');
    }
  };

  // Apply AI findings into the form so user can easily correct any field
  const handleApplyAIToForm = () => {
    if (!aiResult) return;

    if (aiResult.product_name) setValue('title', aiResult.product_name);
    if (aiResult.category && ['clothing', 'plastic', 'electronics', 'furniture', 'glass', 'paper', 'metal', 'household_items', 'other'].includes(aiResult.category)) {
      setValue('category', aiResult.category as AnalyzerCategory);
    }
    if (aiResult.possible_material && ['cotton', 'plastic', 'wood', 'glass', 'metal', 'paper', 'leather', 'electronic_components', 'mixed_material', 'unknown'].includes(aiResult.possible_material)) {
      setValue('material', aiResult.possible_material as any);
    }
    if (aiResult.visible_condition && ['like_new', 'good', 'needs_repair', 'damaged', 'unusable'].includes(aiResult.visible_condition)) {
      setValue('condition', aiResult.visible_condition as AnalyzerCondition);
    }

    toast.success('AI estimates applied to form. You can now modify and correct any fields.', 'Form Updated');
  };

  const onSubmit = async (data: AnalyzerFormData) => {
    setIsAnalyzing(true);

    try {
      // 1. Create product domain record
      const productId = `prod-${Date.now()}`;
      const productRecord: ProductItem = {
        id: productId,
        title: data.title,
        category: data.category,
        material: data.material,
        condition: data.condition,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
        createdAt: new Date().toISOString(),
        userId: user?.id,
      };

      // 2. Run Recommendation Engine
      const result = generateRecommendations(productRecord);

      // 3. Persist product analysis & generated recommendations to Supabase if connected
      if (isSupabaseConfigured && user) {
        try {
          const { data: analysisData } = await supabase
            .from('product_analyses')
            .insert({
              user_id: user.id,
              product_name: productRecord.title,
              category: productRecord.category,
              condition: productRecord.condition,
              description: productRecord.description,
              material: productRecord.material,
              image_url: productRecord.imageUrl,
            })
            .select()
            .single();

          const analysisId = analysisData?.id || productId;

          // Insert generated 5-path recommendations
          const recRows = Object.entries(result.actionPlans).map(([action, plan]) => ({
            product_analysis_id: analysisId,
            action_type: action,
            title: plan.title,
            summary: plan.summary,
            difficulty: plan.difficulty,
            estimated_time: plan.estimatedEffort,
            co2_kg_saved: plan.environmentalImpact.co2KgSaved,
            waste_kg_diverted: plan.environmentalImpact.wasteKgDiverted,
            steps: plan.steps,
            required_materials: plan.requiredMaterials || [],
            safety_notes: plan.safetyNotes,
            safety_risk_level: plan.safetyRiskLevel,
            rank_score: plan.rankScore || 0,
          }));

          if (recRows.length > 0) {
            await supabase.from('recommendations').insert(recRows);
          }
        } catch (dbErr) {
          console.warn('Supabase product_analyses insert note:', dbErr);
        }
      }

      // 4. Save state locally to ensure instant navigation access and dashboard reflection
      sessionStorage.setItem('reusehub_latest_analysis', JSON.stringify(result));
      try {
        const storedStr = localStorage.getItem('reusehub_user_analyzed_products');
        const stored = storedStr ? JSON.parse(storedStr) : [];
        const newAnalysisItem = {
          id: productId,
          title: data.title,
          category: data.category,
          material: data.material,
          condition: data.condition,
          description: data.description,
          imageUrl: data.imageUrl || undefined,
          recommendedAction: result.recommendedAction,
          co2EstimateKg: result.actionPlans[result.recommendedAction]?.environmentalImpact.co2KgSaved || 5.0,
          createdAt: 'Just now',
        };
        localStorage.setItem('reusehub_user_analyzed_products', JSON.stringify([newAnalysisItem, ...stored]));
      } catch (storageErr) {
        console.warn('Dashboard analysis storage note:', storageErr);
      }

      // 5. Short natural transition delay
      setTimeout(() => {
        setIsAnalyzing(false);
        toast.success(`Evaluated circular pathways for "${data.title}"`, 'Analysis Ready');
        navigate(
          `/recommendations?id=${productId}&title=${encodeURIComponent(data.title)}&category=${data.category}&condition=${data.condition}&material=${data.material}`
        );
      }, 500);
    } catch (err: any) {
      setIsAnalyzing(false);
      toast.error(err?.message || 'Failed to complete analysis. Please check your inputs.', 'Analysis Error');
    }
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg text-brand-text">
      <Container size="md">
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-secondary" />
            <span>Circular Decision Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-primary tracking-tight">
            Let's Give Your Product a Second Life.
          </h1>

          <p className="text-base text-brand-muted leading-relaxed">
            Tell us what you have. We will help you discover what it could become.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-soft-sm text-left">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. PRODUCT NAME */}
            <div>
              <Input
                label="1. Product Name *"
                placeholder="e.g. Levi's Denim Jeans, Solid Pine Dining Chair, Sony Headphones, Glass Pickle Jar..."
                error={errors.title?.message}
                helperText="Be specific with brand, model, or type to help estimate accurate mass and carbon offset."
                {...register('title')}
              />
            </div>

            {/* 2. PRODUCT CATEGORY */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text">
                  2. Product Category *
                </label>
                <span className="text-xs text-brand-muted">Select matching type</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {categoryOptions.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setValue('category', cat.id, { shouldValidate: true, shouldDirty: true });
                        setValue('material', CATEGORY_DEFAULT_MATERIAL[cat.id], { shouldValidate: true, shouldDirty: true });
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all duration-150 select-none ${
                        isSelected
                          ? 'border-brand-primary bg-forest-50/80 text-brand-primary font-bold ring-1 ring-brand-primary shadow-soft-xs'
                          : 'border-brand-border hover:border-brand-secondary/60 text-brand-muted hover:text-brand-text bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isSelected ? 'text-brand-secondary' : 'text-brand-muted'
                          }`}
                        />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* 3. PRODUCT MATERIAL */}
            <div>
              <Select
                label="3. Product Material *"
                options={dynamicMaterialOptions}
                value={selectedMaterial}
                error={errors.material?.message}
                helperText="Primary material composition guides safe disassembly and recycling blueprints."
                name="material"
                onChange={(e) => {
                  setValue('material', e.target.value as AnalyzerFormData['material'], {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />
            </div>

            {/* 4. PRODUCT CONDITION */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text">
                  4. Product Condition *
                </label>
                <span className="text-xs text-brand-muted">Physical & operational state</span>
              </div>

              <div className="space-y-2.5">
                {conditionOptions.map((cond) => {
                  const isSelected = selectedCondition === cond.id;
                  return (
                    <label
                      key={cond.id}
                      onClick={() => setValue('condition', cond.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-brand-primary bg-forest-50/70 ring-1 ring-brand-primary shadow-soft-xs'
                          : 'border-brand-border hover:border-brand-secondary/50 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        value={cond.id}
                        checked={isSelected}
                        onChange={() => setValue('condition', cond.id)}
                        className="mt-0.5 text-brand-primary focus:ring-brand-primary cursor-pointer"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-primary text-sm">
                            {cond.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
                          )}
                        </div>
                        <p className="text-brand-muted mt-0.5 leading-relaxed">
                          {cond.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
              {errors.condition && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  {errors.condition.message}
                </p>
              )}
            </div>

            {/* 5. PRODUCT DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text">
                5. Product Description *
              </label>
              <textarea
                rows={3}
                placeholder="Describe why you are replacing this item, any known faults, missing parts, or dimensions..."
                className="w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/60 transition-all duration-200 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                {...register('description')}
              />
              {errors.description ? (
                <p className="text-xs text-red-600 font-medium">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-xs text-brand-muted">
                  Detailed notes help tailor step-by-step repair tools and donation guidelines.
                </p>
              )}
            </div>

            {/* 6. PRODUCT IMAGE UPLOAD & OPTIONAL AI RECOGNITION */}
            <div className="space-y-3">
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    label="6. Product Image (Optional)"
                    bucket="product-images"
                    userId={user?.id}
                    value={field.value}
                    onChange={(url) => {
                      field.onChange(url);
                      setAiResult(null); // reset AI result on new photo
                    }}
                    maxSizeBytes={5 * 1024 * 1024} // 5 MB
                    helperText="Upload JPG, PNG, or WEBP up to 5MB. Photos are stored securely in Supabase Storage to generate visual listings."
                  />
                )}
              />

              {/* Optional AI Image Recognition Trigger Button */}
              {currentImageUrl && (
                <div className="p-3.5 rounded-2xl bg-forest-50 border border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <Eye className="w-4 h-4 text-brand-secondary shrink-0" />
                    <div>
                      <span className="font-bold block">Optional AI Vision Estimation</span>
                      <span className="text-[11px] text-brand-muted">
                        Estimate category, material, and surface condition from this photo.
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleTriggerAI}
                    isLoading={isScanningAI}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-secondary" />}
                  >
                    Estimate Product With AI
                  </Button>
                </div>
              )}

              {/* AI Recognition Results & Correction Banner */}
              {aiResult && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-brand-secondary/40 bg-white shadow-soft-sm space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-brand-primary font-bold text-[11px] uppercase tracking-wider">
                        AI Image Recognition Result
                      </span>
                      <span className="text-[11px] font-mono text-brand-secondary font-semibold">
                        {(aiResult.confidence * 100).toFixed(0)}% Visual Match
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAiResult(null)}
                      className="text-xs text-brand-muted hover:text-brand-text"
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Identified Observations Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-forest-50/60 border border-brand-border">
                      <span className="text-[10px] text-brand-muted block uppercase">Estimated Name</span>
                      <span className="font-bold text-brand-primary">{aiResult.product_name}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-forest-50/60 border border-brand-border">
                      <span className="text-[10px] text-brand-muted block uppercase">Category</span>
                      <span className="font-bold text-brand-primary capitalize">{aiResult.category}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-forest-50/60 border border-brand-border">
                      <span className="text-[10px] text-brand-muted block uppercase">Possible Material</span>
                      <span className="font-bold text-brand-primary capitalize">{aiResult.possible_material}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-forest-50/60 border border-brand-border">
                      <span className="text-[10px] text-brand-muted block uppercase">Visible Condition</span>
                      <span className="font-bold text-brand-primary capitalize">{aiResult.visible_condition.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* AI Safety Notes */}
                  {aiResult.safety_notes && aiResult.safety_notes.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Visual Estimation Safety Note:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {aiResult.safety_notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* User Review & Form Correction Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-brand-border text-xs">
                    <span className="text-brand-muted text-[11px]">
                      You can modify or override any estimated field directly in the form inputs above.
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleApplyAIToForm}
                        leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
                      >
                        Apply AI Estimates to Form
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Notice if Server API is Unconfigured */}
              {aiNotice && (
                <div className="p-3 rounded-xl bg-forest-50 border border-brand-border text-[11px] text-brand-muted flex items-start gap-2">
                  <Info className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                  <span>{aiNotice}</span>
                </div>
              )}
            </div>

            {/* Methodology & Algorithmic Notice */}
            <div className="p-4 rounded-2xl bg-forest-50/80 border border-brand-border text-xs text-brand-muted flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-brand-primary">
                  Structured Rule-Based Decision Engine & Verified LCA
                </span>
                <p className="leading-relaxed">
                  Final recommendations are computed through our verified environmental rule-based engine, evaluating structural safety, condition feasibility, and regional drop-off centers.
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                <Info className="w-4 h-4 text-brand-secondary shrink-0" />
                <span>All 5 circular pathways evaluated simultaneously.</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isAnalyzing}
                disabled={isAnalyzing}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto min-w-[220px] font-semibold"
              >
                Analyze My Product
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};
