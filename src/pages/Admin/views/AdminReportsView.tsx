import React, { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ConfirmActionModal } from '@/components/admin/ConfirmActionModal';
import { ContentReport } from '@/types';
import {
  Flag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export interface AdminReportsViewProps {
  reports: ContentReport[];
  onResolveReport: (reportId: string, action: 'resolved' | 'dismissed', notes: string) => Promise<void>;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({
  reports,
  onResolveReport,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed'>('pending');
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);

  const [actionTarget, setActionTarget] = useState<{
    report: ContentReport;
    action: 'resolved' | 'dismissed';
  } | null>(null);

  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter === 'all') return true;
      return r.status === statusFilter;
    });
  }, [reports, statusFilter]);

  const handleOpenAction = (report: ContentReport, action: 'resolved' | 'dismissed') => {
    setActionTarget({ report, action });
    setAdminNotes('');
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setIsSubmitting(true);
    try {
      await onResolveReport(
        actionTarget.report.id,
        actionTarget.action,
        adminNotes || `Report marked as ${actionTarget.action} by administrator`
      );
      setActionTarget(null);
      if (selectedReport?.id === actionTarget.report.id) {
        setSelectedReport(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
          <Flag className="w-3.5 h-3.5 text-amber-600" />
          <span>Moderation Queue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
          Content Moderation Reports ({reports.length})
        </h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          Review community and marketplace reports flagged by members for quality, safety, or policy violations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-forest-100 pb-2 overflow-x-auto text-xs">
        {(['pending', 'all', 'reviewed', 'resolved', 'dismissed'] as const).map((st) => {
          const count = st === 'all' ? reports.length : reports.filter((r) => r.status === st).length;
          const isActive = statusFilter === st;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors capitalize flex items-center gap-1.5 ${
                isActive
                  ? 'bg-forest-900 text-white font-semibold'
                  : 'bg-white text-forest-700 hover:bg-forest-100/60 border border-forest-100'
              }`}
            >
              <span>{st}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-forest-800 text-emerald-300' : 'bg-forest-100 text-forest-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <Card variant="bordered" className="p-8 text-center bg-white">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-forest-900">Moderation Queue is Clear</h4>
            <p className="text-xs text-dark-muted mt-1">
              No reports currently matching the "{statusFilter}" filter.
            </p>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              variant="bordered"
              className="p-5 bg-white space-y-3 hover:border-forest-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      report.contentType === 'marketplace_listing'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-purple-100 text-purple-900'
                    }`}
                  >
                    {report.contentType === 'marketplace_listing' ? (
                      <ShoppingBag className="w-3 h-3" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {report.contentType.replace(/_/g, ' ')}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                      report.status === 'pending'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : report.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-forest-50 text-forest-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="text-[11px] text-dark-subtle flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Reported {new Date(report.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-forest-900">
                  Target: {report.contentTitle}
                </h3>
                <div className="text-xs text-forest-800 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Flag Reason: {report.reason.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <p className="text-xs text-dark-muted leading-relaxed bg-forest-50/30 p-2.5 rounded-xl border border-forest-100">
                  "{report.details}"
                </p>
              </div>

              {report.adminNotes && (
                <div className="text-[11px] text-forest-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  <strong>Admin Note:</strong> {report.adminNotes}
                </div>
              )}

              <div className="pt-2 border-t border-forest-100 flex items-center justify-between">
                <div className="text-[11px] text-dark-subtle">
                  Reporter: {report.reporterEmail || 'Registered Member'}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSelectedReport(report)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Details
                  </Button>

                  {report.status === 'pending' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-forest-700 hover:text-forest-900"
                        onClick={() => handleOpenAction(report, 'dismissed')}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs bg-emerald-700 hover:bg-emerald-800"
                        onClick={() => handleOpenAction(report, 'resolved')}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Resolve Report
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Content Moderation Incident Details"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-forest-50/50 border border-forest-100 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-forest-600 block">
                {selectedReport.contentType.replace(/_/g, ' ')}
              </span>
              <h3 className="text-sm font-bold text-forest-900">{selectedReport.contentTitle}</h3>
              <p className="text-xs text-dark-subtle">Target ID: <code>{selectedReport.contentId}</code></p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">Reporter's Grievance</label>
              <div className="p-3 rounded-xl bg-white border border-forest-200 text-xs text-dark-muted space-y-1">
                <div className="font-semibold text-forest-900 capitalize">
                  Violation Category: {selectedReport.reason.replace(/_/g, ' ')}
                </div>
                <p className="leading-relaxed">{selectedReport.details}</p>
                <div className="text-[10px] text-dark-subtle pt-1 border-t border-forest-100">
                  Submitted by {selectedReport.reporterEmail || 'Member'} on{' '}
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {selectedReport.status === 'pending' && (
              <div className="pt-3 border-t border-forest-100 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenAction(selectedReport, 'dismissed')}
                >
                  Dismiss Report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenAction(selectedReport, 'resolved')}
                >
                  Resolve Report
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmActionModal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={handleConfirmAction}
        isLoading={isSubmitting}
        title={actionTarget?.action === 'resolved' ? 'Resolve Content Report' : 'Dismiss Content Report'}
        description={
          actionTarget?.action === 'resolved'
            ? `Marking this report as RESOLVED confirms administrative remediation has been completed for "${actionTarget?.report.contentTitle}".`
            : `Dismissing this report records that the reported item did not breach platform safety or quality guidelines.`
        }
        confirmLabel={actionTarget?.action === 'resolved' ? 'Resolve Report' : 'Dismiss Report'}
        isDestructive={false}
        additionalInput={
          <div className="space-y-1">
            <label className="text-xs font-semibold text-forest-900">
              Administrative Resolution Notes (Recorded in Audit Trail)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Content inspected and verified compliant, or seller instructed to update description..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
              required
            />
          </div>
        }
      />
    </div>
  );
};
