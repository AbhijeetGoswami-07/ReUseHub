import React from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import {
  ECO_SCORING_RULES,
  ECO_TIERS,
} from '@/services/ecoScoreService';
import {
  ShieldCheck,
  Scale,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export interface EcoScoreMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcoScoreMethodologyModal: React.FC<EcoScoreMethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="ReUseHub EcoScore Methodology & Scoring Transparency"
      description="Our audited points-based scoring framework prioritizing the circular waste hierarchy, real physical diversion, and verifiable community actions."
    >
      <div className="space-y-6 pt-2 pb-4 text-xs sm:text-sm text-brand-text leading-relaxed">
        {/* Core Principles Alert */}
        <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase text-brand-primary tracking-wide">
            <ShieldCheck className="w-4 h-4 text-brand-secondary" />
            <span>Anti-Greenwashing & Methodology Principles</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            ReUseHub strictly avoids invented carbon offsets or unverifiable environmental savings claims. Instead, we implement a documented, points-based scoring formula coupled with transparent distinctions between <strong>user-estimated physical mass</strong>, <strong>verification integrity tiers</strong>, and <strong>illustrative lifecycle benchmarks</strong>.
          </p>
        </div>

        {/* 1. Mathematical Scoring Formula */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-base text-brand-primary flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-secondary" />
            <span>1. Transparent Points Calculation Formula</span>
          </h4>

          <div className="p-3.5 rounded-xl bg-brand-bg border border-brand-border font-mono text-xs text-brand-primary space-y-1">
            <div className="font-bold">Total EcoScore Points = Base Points + (Weight in kg × Rate per kg) + Verification Bonus</div>
            <div className="text-[11px] font-sans text-brand-muted">
              Example: Repairing an 8.0 kg wooden chair with photo evidence = 50 base + (8.0 × 10) + 15 bonus = 145 EcoScore Points.
            </div>
          </div>
        </div>

        {/* 2. Circular Hierarchy Scoring Matrix Table */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-base text-brand-primary flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-secondary" />
            <span>2. Activity Hierarchy Scoring Matrix</span>
          </h4>

          <div className="overflow-x-auto rounded-xl border border-brand-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-bg border-b border-brand-border text-brand-primary font-bold">
                  <th className="p-2.5">Activity Type</th>
                  <th className="p-2.5">Circular Priority</th>
                  <th className="p-2.5">Base Points</th>
                  <th className="p-2.5">Mass Rate</th>
                  <th className="p-2.5">Illustrative LCA Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {Object.entries(ECO_SCORING_RULES).map(([key, rule]) => (
                  <tr key={key} className="hover:bg-forest-50/50 transition-colors">
                    <td className="p-2.5 font-bold capitalize text-brand-primary">{key}</td>
                    <td className="p-2.5 text-brand-muted">{rule.title}</td>
                    <td className="p-2.5 font-bold text-brand-secondary">+{rule.basePoints} pts</td>
                    <td className="p-2.5 text-brand-text">+{rule.pointsPerKg} pts / kg</td>
                    <td className="p-2.5 text-emerald-800 font-medium">~{rule.illustrativeCo2FactorPerKg} kg CO2e/kg*</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-brand-muted italic">
            *Illustrative lifecycle emissions estimates are derived from EPA Waste Reduction Model (WARM v15) sector averages and European Environment Agency circular indicators. They serve solely as illustrative educational references.
          </p>
        </div>

        {/* 3. Verification Integrity Tiers */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-base text-brand-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
            <span>3. Activity Verification Integrity Tiers</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1.5">
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 font-bold text-[10px] uppercase">
                Tier 1: User-Reported
              </span>
              <div className="font-bold text-xs text-brand-primary">+0 Bonus Points</div>
              <p className="text-[11px] text-brand-muted">
                Self-declared completed activity. Recorded in personal activity history and credited at baseline rates.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1.5">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px] uppercase">
                Tier 2: Photo-Verified
              </span>
              <div className="font-bold text-xs text-blue-700">+15 Bonus Points</div>
              <p className="text-[11px] text-brand-muted">
                User provides before/after visual proof, repair seam detail, or drop-off container photographic documentation.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-brand-border bg-white space-y-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase">
                Tier 3: Community-Confirmed
              </span>
              <div className="font-bold text-xs text-emerald-700">+25 Bonus Points</div>
              <p className="text-[11px] text-brand-muted">
                Authenticated handovers confirmed by marketplace recipients, school recipients, or municipal collection receipts.
              </p>
            </div>
          </div>
        </div>

        {/* 4. EcoScore Recognition Tiers */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-base text-brand-primary flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-secondary" />
            <span>4. Recognition Tiers & Progression</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {ECO_TIERS.map((tier) => (
              <div key={tier.name} className="p-2.5 rounded-xl border border-brand-border bg-white space-y-1">
                <span className="text-[10px] font-bold text-brand-muted block">Level {tier.level}</span>
                <strong className="block text-brand-primary truncate">{tier.name}</strong>
                <span className="text-[10px] text-brand-muted block">{tier.min}+ pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-brand-border flex items-center justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Understood & Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
