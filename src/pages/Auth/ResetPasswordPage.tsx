import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Lock, KeyRound, CheckCircle2 } from 'lucide-react';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    const { error } = await updatePassword(data.password);
    setIsLoading(false);

    if (error) {
      toast.error(error.message, 'Password Update Failed');
      return;
    }

    toast.success('Your password has been securely updated.', 'Password Reset Successful');
    navigate('/login');
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
              Set New Password
            </h1>
            <p className="text-xs text-brand-muted">
              Choose a strong password with at least 6 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-semibold"
                isLoading={isLoading}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};
