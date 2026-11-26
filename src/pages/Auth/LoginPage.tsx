import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Lock, ArrowRight, Sprout, ShieldCheck, UserCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(true),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { signIn, isConfigured } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdminParam = searchParams.get('admin') === 'true';
  const redirectPath = searchParams.get('redirect') || (isAdminParam ? '/admin' : '/profile');

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: isAdminParam ? 'admin.lead@reusehub.org' : '',
      password: isAdminParam ? 'password123' : '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password, data.rememberMe);
    setIsLoading(false);

    if (error) {
      toast.error(error.message, 'Login Failed');
      return;
    }

    toast.success('Successfully authenticated.', 'Welcome Back');
    navigate(redirectPath);
  };

  const fillQuickAccount = (email: string, roleName: string) => {
    setValue('email', email);
    setValue('password', 'password123');
    toast.info(`Filled credentials for ${roleName}. Click 'Sign In' below.`);
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
              Welcome Back
            </h1>
            <p className="text-xs text-brand-muted">
              Sign in to manage your circular reuse plans and verified carbon logs.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-text">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand-secondary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                className="rounded border-brand-border text-brand-primary focus:ring-brand-primary cursor-pointer"
                {...register('rememberMe')}
              />
              <label htmlFor="rememberMe" className="text-xs text-brand-muted cursor-pointer select-none">
                Remember authentication session
              </label>
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
                Sign In
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          {!isConfigured && (
            <div className="pt-4 border-t border-brand-border/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block text-center">
                Interactive Demo Credentials
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillQuickAccount('student.champion@reusehub.org', 'Student Member')}
                  className="p-2.5 rounded-xl border border-brand-border hover:bg-forest-50/70 text-left transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-brand-secondary shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-brand-primary truncate">Standard User</p>
                    <p className="text-[10px] text-brand-muted truncate">student.champion</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickAccount('admin.lead@reusehub.org', 'System Administrator')}
                  className="p-2.5 rounded-xl border border-brand-border hover:bg-forest-50/70 text-left transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-brand-primary truncate">Admin Tester</p>
                    <p className="text-[10px] text-brand-muted truncate">admin.lead</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Footer Link */}
          <div className="pt-4 border-t border-brand-border text-center text-xs text-brand-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-primary hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
