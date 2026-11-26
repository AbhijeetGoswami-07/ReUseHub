import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Lock, User, ArrowRight, CheckCircle2, ShieldCheck, Sprout } from 'lucide-react';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    const { error, needsEmailVerification } = await signUp(
      data.fullName,
      data.email,
      data.password
    );
    setIsLoading(false);

    if (error) {
      toast.error(error.message, 'Registration Failed');
      return;
    }

    if (needsEmailVerification) {
      setNeedsVerification(true);
      toast.info('Verification link sent to your email.', 'Check Your Inbox');
    } else {
      toast.success('Account created successfully! Welcome to ReUseHub.', 'Account Activated');
      navigate('/profile');
    }
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg flex items-center justify-center min-h-[calc(100vh-160px)]">
      <Container size="sm">
        <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-soft-sm max-w-md mx-auto text-left space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-brand-primary flex items-center justify-center mx-auto shadow-soft-xs">
              <Sprout className="w-6 h-6 text-brand-secondary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-primary">
              Join ReUseHub
            </h1>
            <p className="text-xs text-brand-muted">
              Create an account to start tracking circular actions and saving carbon.
            </p>
          </div>

          {needsVerification ? (
            <div className="p-5 rounded-2xl bg-forest-50 border border-brand-border space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-brand-primary">
                Verify Your Email Address
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                We sent a secure activation link to your inbox. Click the link to complete verification and sign in.
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
              {/* Full Name */}
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.fullName?.message}
                {...register('fullName')}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password */}
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                helperText="Minimum 6 characters"
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {/* Security Policy Reminder */}
              <div className="p-3 rounded-xl bg-forest-50/70 border border-brand-border/60 text-[11px] text-brand-muted flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                <span>
                  Accounts are registered with verified default <code>user</code> roles and encrypted authentication tokens.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-semibold"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}

          {/* Footer Link */}
          <div className="pt-4 border-t border-brand-border text-center text-xs text-brand-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
