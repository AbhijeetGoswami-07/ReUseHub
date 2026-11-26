import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { CommunityPost } from '@/types';
import { CreatePostReportInput } from '@/services/communityService';
import { Flag, AlertTriangle } from 'lucide-react';

export interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPost | null;
  onSubmit: (data: CreatePostReportInput) => Promise<void>;
}

export const ReportPostModal: React.FC<ReportPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onSubmit,
}) => {
  const [reason, setReason] = useState<
    'inappropriate_content' | 'spam_promotional' | 'dangerous_practice' | 'copyright_plagiarism' | 'other'
  >('inappropriate_content');
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || details.trim().length < 10) {
      setError('Please provide at least 10 characters explaining your report.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        postId: post.id,
        postTitle: post.title,
        reason,
        details: details.trim(),
      });
      setDetails('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Report Inappropriate Community Post"
      description={`Submit a content moderation review for "${post.title}".`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 pb-2">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Reason for Report *
          </label>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value as any)}
            options={[
              { value: 'inappropriate_content', label: 'Inappropriate or Offensive Content' },
              { value: 'spam_promotional', label: 'Spam, Commercial, or Promotional' },
              { value: 'dangerous_practice', label: 'Dangerous Practice / Hazardous Instructions' },
              { value: 'copyright_plagiarism', label: 'Copyright Violation or Plagiarism' },
              { value: 'other', label: 'Other Concern' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-text mb-1.5">
            Detailed Explanation *
          </label>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Explain specifically why this post violates community standards or poses a safety risk..."
            className="w-full p-2.5 rounded-xl border border-brand-border text-xs text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-secondary"
          />
        </div>

        <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            leftIcon={<Flag className="w-3.5 h-3.5" />}
            className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
