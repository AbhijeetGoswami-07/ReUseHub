import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Lock, ShieldCheck, Sprout } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, isConfigured, signOut } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Welcome back, ${email.split('@')[0]}!`, 'Signed In');
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user || profile?.email ? 'Member Account' : 'Sign in to ReUseHub'}
      description={
        user || profile?.email
          ? 'Track your cumulative saved carbon, list second-hand items, and bookmark repair guides.'
          : 'Access your circular product history and track verified CO2e savings.'
      }
      size="sm"
    >
      {user || profile?.email ? (
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-xl bg-forest-50 border border-brand-border space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-cream flex items-center justify-center font-bold text-xs">
                {profile?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-brand-primary">{profile?.fullName}</p>
                <p className="text-[11px] text-brand-muted">{profile?.email}</p>
              </div>
            </div>
            <div className="text-[11px] text-brand-muted flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-secondary" />
              <span>{isConfigured ? 'Supabase Live Session' : 'Interactive Demo Account'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                signOut();
                toast.info('Signed out of session');
                onClose();
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('student@university.edu');
                setPassword('password123');
              }}
              className="text-xs text-brand-secondary hover:underline font-medium inline-flex items-center gap-1"
            >
              <Sprout className="w-3 h-3" /> Fill student demo credentials
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
