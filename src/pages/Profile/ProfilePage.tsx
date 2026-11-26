import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ImageUpload } from '@/components/common/ImageUpload';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  Award,
  Leaf,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, signOut, updateProfile } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatarUrl || null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when profile loads
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setAvatarUrl(profile.avatarUrl || null);
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await updateProfile({
      fullName,
      city,
      state,
      avatarUrl: avatarUrl || undefined,
    });
    setIsSaving(false);

    if (error) {
      toast.error(error.message, 'Failed to Update Profile');
      return;
    }

    toast.success('Your profile details have been saved.', 'Profile Updated');
    setIsEditing(false);
  };

  const formattedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'September 15, 2026';

  return (
    <div className="py-12 md:py-20 bg-brand-bg text-brand-text">
      <Container size="md">
        <div className="space-y-8 text-left">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-brand-primary text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-secondary" />
                <span>Verified Circular Member</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-brand-primary">
                Member Profile
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted">
                Manage your credentials, location settings, and environmental achievements.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant={isEditing ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOut();
                  toast.info('Session signed out successfully.');
                }}
                leftIcon={<LogOut className="w-3.5 h-3.5 text-red-600" />}
                className="text-red-700 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="rounded-3xl border border-brand-border bg-white p-6 sm:p-8 shadow-soft-sm space-y-8">
            {/* Top Identity Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-brand-border">
              {/* Profile Image Avatar */}
              <div className="relative">
                {profile?.avatarUrl ? (
                  <ImageWithFallback
                    src={profile.avatarUrl}
                    fallbackType="avatar"
                    alt={profile.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-border shadow-soft-xs"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-brand-primary text-cream flex items-center justify-center font-display font-bold text-3xl shadow-soft-xs">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-soft-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 block" title="Active Account" />
                </div>
              </div>

              {/* Name & Badges */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-display font-bold text-brand-primary">
                    {profile?.fullName || 'Eco Champion'}
                  </h2>
                  <StatusBadge
                    status={profile?.role === 'admin' ? 'verified' : 'active'}
                    size="sm"
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest-100 text-brand-primary font-bold">
                    Role: {profile?.role || 'user'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                    {profile?.email}
                  </span>
                  {(profile?.city || profile?.state) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                      {[profile?.city, profile?.state].filter(Boolean).join(', ')}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                    Member since {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Edit Form vs Read-Only Details */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-5 animate-in fade-in duration-150">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary">
                  Update Account Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />

                  <Input
                    label="Email Address"
                    value={profile?.email || ''}
                    disabled
                    helperText="Email is bound to your secure authentication provider."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="e.g. Seattle, Austin, Bristol"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <Input
                    label="State / Region"
                    placeholder="e.g. Washington, Texas, Oregon"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>

                <ImageUpload
                  label="Profile Avatar Image"
                  bucket="profile-images"
                  userId={profile?.id}
                  value={avatarUrl}
                  onChange={(url) => setAvatarUrl(url)}
                  helperText="Upload a square JPEG, PNG, or WEBP profile photo stored in Supabase Storage."
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSaving}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-forest-50/50 border border-brand-border space-y-1">
                  <span className="text-brand-muted font-medium">City & State Location</span>
                  <p className="font-semibold text-brand-text text-sm">
                    {[profile?.city, profile?.state].filter(Boolean).join(', ') || 'Not specified'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-forest-50/50 border border-brand-border space-y-1">
                  <span className="text-brand-muted font-medium">Security Access Tier</span>
                  <p className="font-semibold text-brand-text text-sm capitalize">
                    {profile?.role === 'admin' ? 'System Administrator' : 'Verified Community Member'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-forest-50/50 border border-brand-border space-y-1">
                  <span className="text-brand-muted font-medium">Account Creation Date</span>
                  <p className="font-semibold text-brand-text text-sm">
                    {formattedDate}
                  </p>
                </div>
              </div>
            )}

            {/* Environmental Impact Statistics Block */}
            <div className="p-5 rounded-2xl bg-brand-primary text-cream space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sage-300 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-sage-300" />
                  Your Ecological Lifetime Contribution
                </span>
                <span className="text-xs font-mono bg-forest-800 px-2 py-0.5 rounded text-sage-200">
                  {profile?.metrics.communityPoints || 340} Community Points
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
                  <div className="text-xl font-bold font-display text-white">
                    {profile?.metrics.totalItemsDiverted || 14}
                  </div>
                  <div className="text-[10px] text-forest-200 mt-0.5">
                    Items Diverted
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
                  <div className="text-xl font-bold font-display text-white">
                    {profile?.metrics.co2SavedKg || 42.8} kg
                  </div>
                  <div className="text-[10px] text-forest-200 mt-0.5">
                    CO2e Avoided
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
                  <div className="text-xl font-bold font-display text-white">
                    {profile?.metrics.wasteDivertedKg || 28.5} kg
                  </div>
                  <div className="text-[10px] text-forest-200 mt-0.5">
                    Landfill Diverted
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
                  <div className="text-xl font-bold font-display text-white flex items-center justify-center gap-1">
                    <Award className="w-4 h-4 text-amber-400" />
                    Level 3
                  </div>
                  <div className="text-[10px] text-forest-200 mt-0.5">
                    Circular Pioneer
                  </div>
                </div>
              </div>
            </div>

            {/* Role Security Callout */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Role-Based Security Policy Notice</span>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  User roles are cryptographically governed by Supabase Row-Level Security (RLS). Users cannot elevate themselves to the Administrator tier via client requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
