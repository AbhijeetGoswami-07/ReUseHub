import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (fullName: string, email: string, password: string) => Promise<{ error: Error | null; needsEmailVerification?: boolean }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: { fullName?: string; city?: string; state?: string; avatarUrl?: string }) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage key for demo fallback persistence
const DEMO_AUTH_KEY = 'reusehub_demo_auth_profile';

const defaultDemoProfile: UserProfile = {
  id: 'usr-eco-champion',
  email: 'eco.champion@reusehub.org',
  fullName: 'Eco Champion',
  role: 'user',
  city: 'Portland',
  state: 'Oregon',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  createdAt: '2026-09-15T10:00:00.000Z',
  metrics: {
    totalItemsDiverted: 14,
    co2SavedKg: 42.8,
    wasteDivertedKg: 28.5,
    communityPoints: 340,
    actionsBreakdown: {
      reuse: 5,
      repair: 3,
      upcycle: 3,
      donate: 2,
      recycle: 1,
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load profile helper
  const fetchSupabaseProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setProfile({
          id: data.id,
          email: data.email || email,
          fullName: data.full_name || 'Community Member',
          role: data.role || 'user',
          avatarUrl: data.avatar_url,
          city: data.city || '',
          state: data.state || '',
          createdAt: data.created_at || new Date().toISOString(),
          metrics: {
            totalItemsDiverted: data.total_items_diverted || 0,
            co2SavedKg: Number(data.co2_saved_kg) || 0,
            wasteDivertedKg: Number(data.waste_diverted_kg) || 0,
            communityPoints: data.community_points || 0,
            actionsBreakdown: { reuse: 0, repair: 0, upcycle: 0, donate: 0, recycle: 0 },
          },
        });
      } else {
        // Fallback profile if trigger hasn't populated yet
        setProfile({
          id: userId,
          email,
          fullName: email.split('@')[0],
          role: 'user',
          createdAt: new Date().toISOString(),
          metrics: defaultDemoProfile.metrics,
        });
      }
    } catch (err) {
      console.error('Profile fetch failed:', err);
    }
  }, []);

  // Initialize Auth
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // In demo mode, restore stored local profile if any
      const savedProfile = localStorage.getItem(DEMO_AUTH_KEY);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email } as User);
        } catch {
          setProfile(defaultDemoProfile);
          setUser({ id: defaultDemoProfile.id, email: defaultDemoProfile.email } as User);
        }
      } else {
        // Default guest user
        setProfile(defaultDemoProfile);
        setUser({ id: defaultDemoProfile.id, email: defaultDemoProfile.email } as User);
      }
      setLoading(false);
      return;
    }

    // Live Supabase flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSupabaseProfile(session.user.id, session.user.email ?? '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSupabaseProfile(session.user.id, session.user.email ?? '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSupabaseProfile]);

  // 1. Sign Up
  const signUp = async (fullName: string, email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo signup
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullName,
        role: email.includes('admin') ? 'admin' : 'user', // strictly for demo testing
        city: 'Seattle',
        state: 'Washington',
        createdAt: new Date().toISOString(),
        metrics: {
          totalItemsDiverted: 0,
          co2SavedKg: 0,
          wasteDivertedKg: 0,
          communityPoints: 50, // Welcome bonus
          actionsBreakdown: { reuse: 0, repair: 0, upcycle: 0, donate: 0, recycle: 0 },
        },
      };
      setProfile(newProfile);
      setUser({ id: newProfile.id, email: newProfile.email } as User);
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(newProfile));
      return { error: null, needsEmailVerification: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      const needsEmailVerification = !data.session;
      if (data.user && data.session) {
        await fetchSupabaseProfile(data.user.id, email);
      }
      return { error: null, needsEmailVerification };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 2. Sign In
  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    if (!isSupabaseConfigured) {
      // Demo signin
      const isAdmin = email.toLowerCase().includes('admin');
      const updatedProfile: UserProfile = {
        ...defaultDemoProfile,
        id: `usr-${Date.now()}`,
        email,
        fullName: email.split('@')[0].replace('.', ' '),
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
      };
      setProfile(updatedProfile);
      setUser({ id: updatedProfile.id, email: updatedProfile.email } as User);
      if (rememberMe) {
        localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(updatedProfile));
      } else {
        localStorage.removeItem(DEMO_AUTH_KEY);
      }
      return { error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchSupabaseProfile(data.user.id, email);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 3. Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(DEMO_AUTH_KEY);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // 4. Reset Password for Email
  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 5. Update Password
  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // 6. Update Profile (Full Name, City, State, Avatar)
  const updateProfile = async (updates: { fullName?: string; city?: string; state?: string; avatarUrl?: string }) => {
    if (!profile) return { error: new Error('No user is currently authenticated') };

    const updated: UserProfile = {
      ...profile,
      fullName: updates.fullName !== undefined ? updates.fullName : profile.fullName,
      city: updates.city !== undefined ? updates.city : profile.city,
      state: updates.state !== undefined ? updates.state : profile.state,
      avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : profile.avatarUrl,
    };

    if (!isSupabaseConfigured) {
      setProfile(updated);
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(updated));
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          city: updated.city,
          state: updated.state,
          avatar_url: updated.avatarUrl,
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(updated);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
