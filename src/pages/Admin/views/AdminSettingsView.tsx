import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ConfirmActionModal } from '@/components/admin/ConfirmActionModal';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { AdminAuditLog, DIYInstructionIdea } from '@/types';
import { isSupabaseConfigured } from '@/services/supabase';
import {
  Settings,
  ShieldCheck,
  Download,
  BookOpen,
  Plus,
  Trash2,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export interface AdminSettingsViewProps {
  auditLogs: AdminAuditLog[];
  reuseIdeas: DIYInstructionIdea[];
  onCreateReuseIdea: (idea: Omit<DIYInstructionIdea, 'id'>) => Promise<void>;
  onDeleteReuseIdea: (id: string, title: string) => Promise<void>;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  auditLogs,
  reuseIdeas,
  onCreateReuseIdea,
  onDeleteReuseIdea,
}) => {
  const [activeSection, setActiveSection] = useState<'audit' | 'educational' | 'system'>('audit');

  // DIY Idea Create Modal
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [ideaForm, setIdeaForm] = useState({
    projectTitle: '',
    category: 'Household Reuse' as any,
    beforeProduct: '',
    finalProduct: '',
    description: '',
    difficultyLevel: 'Easy' as any,
    estimatedCompletionTime: '30 mins',
    materials: '',
    tools: '',
    instructionSteps: '',
    safetyNotes: '',
    relevantImage: '',
    co2SavedKg: 5.0,
  });

  const [deleteIdeaTarget, setDeleteIdeaTarget] = useState<DIYInstructionIdea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Export audit logs as JSON
  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reusehub_admin_audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreateIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const materialsArr = ideaForm.materials.split('\n').filter((m) => m.trim().length > 0);
      const toolsArr = ideaForm.tools.split('\n').filter((t) => t.trim().length > 0);
      const stepsArr = ideaForm.instructionSteps
        .split('\n')
        .filter((s) => s.trim().length > 0)
        .map((step, idx) => ({
          stepNumber: idx + 1,
          instruction: step.trim(),
        }));
      const safetyArr = ideaForm.safetyNotes.split('\n').filter((s) => s.trim().length > 0);

      await onCreateReuseIdea({
        projectTitle: ideaForm.projectTitle,
        category: ideaForm.category,
        beforeProduct: ideaForm.beforeProduct,
        finalProduct: ideaForm.finalProduct,
        description: ideaForm.description,
        difficultyLevel: ideaForm.difficultyLevel,
        estimatedCompletionTime: ideaForm.estimatedCompletionTime,
        requiredMaterials: materialsArr.length > 0 ? materialsArr : ['Clean household supplies'],
        toolsRequired: toolsArr.length > 0 ? toolsArr : ['Scissors or utility blade'],
        stepByStepInstructions: stepsArr.length > 0 ? stepsArr : [{ stepNumber: 1, instruction: 'Assemble supplies and clean item thoroughly.' }],
        safetyPrecautions: safetyArr.length > 0 ? safetyArr : ['Wear standard eye protection if using sharp hand tools.'],
        relevantImage: ideaForm.relevantImage || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        co2SavedKg: Number(ideaForm.co2SavedKg) || 4.5,
      });

      setIsIdeaModalOpen(false);
      setIdeaForm({
        projectTitle: '',
        category: 'Household Reuse',
        beforeProduct: '',
        finalProduct: '',
        description: '',
        difficultyLevel: 'Easy',
        estimatedCompletionTime: '30 mins',
        materials: '',
        tools: '',
        instructionSteps: '',
        safetyNotes: '',
        relevantImage: '',
        co2SavedKg: 5.0,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteIdea = async () => {
    if (!deleteIdeaTarget) return;
    setIsSubmitting(true);
    try {
      await onDeleteReuseIdea(deleteIdeaTarget.id, deleteIdeaTarget.projectTitle);
      setDeleteIdeaTarget(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
            System Settings & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            Manage educational reuse blueprints, inspect immutable audit trails, and review environment diagnostics.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-forest-100 pb-2 text-xs">
        <button
          onClick={() => setActiveSection('audit')}
          className={`px-3.5 py-2 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeSection === 'audit'
              ? 'bg-forest-900 text-white font-semibold'
              : 'bg-white text-forest-700 hover:bg-forest-100/60 border border-forest-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('educational')}
          className={`px-3.5 py-2 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeSection === 'educational'
              ? 'bg-forest-900 text-white font-semibold'
              : 'bg-white text-forest-700 hover:bg-forest-100/60 border border-forest-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>DIY Reuse Content ({reuseIdeas.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('system')}
          className={`px-3.5 py-2 rounded-xl font-medium transition-colors flex items-center gap-1.5 ${
            activeSection === 'system'
              ? 'bg-forest-900 text-white font-semibold'
              : 'bg-white text-forest-700 hover:bg-forest-100/60 border border-forest-100'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>System Diagnostics</span>
        </button>
      </div>

      {/* SECTION 1: AUDIT TRAIL */}
      {activeSection === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-muted">
              Append-only immutable record of all administrative operations.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAuditLogs}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Export Audit Trail (JSON)
            </Button>
          </div>

          <Card variant="bordered" className="bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-forest-50/60 border-b border-forest-100 text-forest-800 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target Type</th>
                    <th className="py-3 px-4">Target Name / ID</th>
                    <th className="py-3 px-4">Admin Email</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-dark-muted">
                        No audit records currently found.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-forest-50/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-forest-900 capitalize">
                            {log.actionType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest-100 text-forest-800 uppercase">
                            {log.targetType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-forest-900 truncate max-w-xs">
                          {log.targetName || log.targetId}
                        </td>
                        <td className="py-3 px-4 text-dark-muted">{log.adminEmail}</td>
                        <td className="py-3 px-4 text-dark-subtle text-[11px] truncate max-w-xs">
                          {log.details ? JSON.stringify(log.details) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right text-dark-subtle text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 2: EDUCATIONAL DIY REUSE IDEAS */}
      {activeSection === 'educational' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-dark-muted">
              Curate official step-by-step DIY blueprints shown in the "Discover Reuse Ideas" library.
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsIdeaModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Add Educational Blueprint
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reuseIdeas.map((idea) => (
              <Card key={idea.id} variant="bordered" className="p-4 bg-white space-y-3">
                <div className="flex gap-3">
                  <ImageWithFallback
                    src={idea.relevantImage}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-forest-100"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-forest-600 block truncate">
                      {idea.category}
                    </span>
                    <h4 className="text-xs font-bold text-forest-900 line-clamp-1">{idea.projectTitle}</h4>
                    <span className="text-[11px] text-dark-subtle block">
                      {idea.beforeProduct} ➔ {idea.finalProduct}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-dark-muted line-clamp-2">{idea.description}</p>

                <div className="pt-2 border-t border-forest-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-emerald-700">
                    {idea.co2SavedKg} kg CO₂ saved
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[11px] text-red-600 hover:bg-red-50 h-7 px-2"
                    onClick={() => setDeleteIdeaTarget(idea)}
                    leftIcon={<Trash2 className="w-3 h-3" />}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: SYSTEM DIAGNOSTICS */}
      {activeSection === 'system' && (
        <div className="space-y-4">
          <Card variant="bordered" className="p-6 bg-white space-y-4">
            <h3 className="text-sm font-bold text-forest-900 border-b border-forest-100 pb-3">
              Environment & Runtime Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-forest-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-forest-600" />
                  <div>
                    <span className="font-semibold text-forest-900 block">Supabase Backend</span>
                    <span className="text-[11px] text-dark-subtle">PostgreSQL & Auth client with RLS security policies</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {isSupabaseConfigured ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Cloud
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" /> Local Fallback
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-forest-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-forest-600" />
                  <div>
                    <span className="font-semibold text-forest-900 block">5-Path Recommendation Engine</span>
                    <span className="text-[11px] text-dark-subtle">Reuse, Repair, Upcycle, Donate, Recycle algorithmic rules</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Initialized
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-forest-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-forest-600" />
                  <div>
                    <span className="font-semibold text-forest-900 block">Server-Side Admin Role Verification</span>
                    <span className="text-[11px] text-dark-subtle">Zero trust for client claims; profiles table verification</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Enforced
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Create Educational Idea Modal */}
      {isIdeaModalOpen && (
        <Modal
          isOpen={isIdeaModalOpen}
          onClose={() => setIsIdeaModalOpen(false)}
          title="Publish Educational DIY Reuse Blueprint"
          size="lg"
        >
          <form onSubmit={handleCreateIdeaSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">Project Title</label>
              <input
                type="text"
                value={ideaForm.projectTitle}
                onChange={(e) => setIdeaForm({ ...ideaForm, projectTitle: e.target.value })}
                placeholder="e.g. Mason Jar Bathroom Q-Tip Organizer"
                className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">Category</label>
                <select
                  value={ideaForm.category}
                  onChange={(e) => setIdeaForm({ ...ideaForm, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs bg-white"
                >
                  <option value="Clothing Upcycling">Clothing Upcycling</option>
                  <option value="Plastic Reuse">Plastic Reuse</option>
                  <option value="Glass Reuse">Glass Reuse</option>
                  <option value="Paper Crafts">Paper Crafts</option>
                  <option value="Furniture Restoration">Furniture Restoration</option>
                  <option value="Household Reuse">Household Reuse</option>
                  <option value="Metal Reuse">Metal Reuse</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">Difficulty</label>
                <select
                  value={ideaForm.difficultyLevel}
                  onChange={(e) => setIdeaForm({ ...ideaForm, difficultyLevel: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">Before Product</label>
                <input
                  type="text"
                  value={ideaForm.beforeProduct}
                  onChange={(e) => setIdeaForm({ ...ideaForm, beforeProduct: e.target.value })}
                  placeholder="e.g. Empty Jam Jar"
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">Final Product</label>
                <input
                  type="text"
                  value={ideaForm.finalProduct}
                  onChange={(e) => setIdeaForm({ ...ideaForm, finalProduct: e.target.value })}
                  placeholder="e.g. Bathroom Organizer"
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">Description</label>
              <textarea
                value={ideaForm.description}
                onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                placeholder="Comprehensive description of the transformation..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">
                Step-by-Step Instructions (One step per line)
              </label>
              <textarea
                value={ideaForm.instructionSteps}
                onChange={(e) => setIdeaForm({ ...ideaForm, instructionSteps: e.target.value })}
                placeholder="Step 1: Clean and dry container&#10;Step 2: Paint exterior with chalkboard paint&#10;Step 3: Allow 24h cure time"
                rows={3}
                className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">Estimated Duration</label>
                <input
                  type="text"
                  value={ideaForm.estimatedCompletionTime}
                  onChange={(e) => setIdeaForm({ ...ideaForm, estimatedCompletionTime: e.target.value })}
                  placeholder="e.g. 45 mins"
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-forest-900">CO₂ Avoided (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ideaForm.co2SavedKg}
                  onChange={(e) => setIdeaForm({ ...ideaForm, co2SavedKg: parseFloat(e.target.value) || 2.0 })}
                  className="w-full p-2.5 rounded-xl border border-forest-200 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-forest-100 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsIdeaModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Publish Blueprint
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmActionModal
        isOpen={!!deleteIdeaTarget}
        onClose={() => setDeleteIdeaTarget(null)}
        onConfirm={handleConfirmDeleteIdea}
        isLoading={isSubmitting}
        title="Delete Educational DIY Blueprint"
        description={`Are you sure you want to delete "${deleteIdeaTarget?.projectTitle}"? It will be permanently removed from the public DIY guide library.`}
        confirmLabel="Delete Blueprint"
        isDestructive={true}
      />
    </div>
  );
};
