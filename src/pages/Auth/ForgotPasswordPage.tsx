import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { resetPasswordForEmail } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    const { error } = await resetPasswordForEmail(data.email);
    setIsLoading(false);

    if (error) {
      toast.error(error.message, 'Reset Request Failed');
      return;
    }

    setIsSubmitted(true);
    toast.success('Password recovery instructions sent.', 'Check Email');
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg flex items-center justify-center min-h-[calc(100vh-160px)]">
      <Container size="sm">
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-soft-sm max-w-md mx-auto text-left space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-brand-primary flex items-center justify-center mx-auto shadow-soft-xs">
              <KeyRound className="w-6 h-6 text-brand-secondary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-primary">
              Password Recovery
            </h1>
            <p className="text-xs text-brand-muted">
              Enter your registered email address to receive password reset instructions.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-5 rounded-2xl bg-forest-50 border border-brand-border space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary">
                Instructions Dispatched
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                If an account matches that email address, you will receive a secure reset link valid for 60 minutes.
              </p>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="primary" size="sm" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="you@domain.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-semibold"
                  isLoading={isLoading}
                >
                  Send Recovery Link
                </Button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-brand-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
