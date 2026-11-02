import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, UserPlan, UserRole } from '../types';
import { supabase, isRealSupabaseConfigured, userStorage, referralStorage } from '../lib/supabase';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  plan: UserPlan;
  role: UserRole;
  isPro: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  signup: (email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  upgradeToPro: () => void;
  downgradeToFree: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'signalpulse_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      if (isRealSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const u = data.session.user;
            setUser({ id: u.id, email: u.email || '' });
            // Fetch profile from supabase table
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', u.id)
              .single();

            if (prof) {
              setProfile(prof as Profile);
            } else {
              const defaultProf: Profile = {
                id: u.id,
                email: u.email || '',
                role: 'user',
                plan: 'free',
                created_at: new Date().toISOString(),
              };
              setProfile(defaultProf);
            }
          }
        } catch (e) {
          console.warn('Real Supabase session check failed, falling back to local session:', e);
        }
      } else {
        // Local-first persistent auth session
        const saved = localStorage.getItem(CURRENT_USER_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.full_name === 'Alex Trader') {
              parsed.full_name = 'Kamboh Trader';
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
            }
            setUser({ id: parsed.id, email: parsed.email });
            setProfile(parsed);
          } catch {
            // fallback
          }
        } else {
          // Default convenient guest / preview account
          const demoUser: Profile = {
            id: 'demo-user-1',
            email: 'trader@kambohplus.com',
            full_name: 'Kamboh Trader',
            role: 'admin', // defaulted to admin so user can test all features including /admin and free/pro toggles
            plan: 'pro',
            created_at: new Date().toISOString(),
          };
          setUser({ id: demoUser.id, email: demoUser.email });
          setProfile(demoUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    if (isRealSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        return { error: error.message };
      }
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email || '' });
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (prof) setProfile(prof as Profile);
      }
      setLoading(false);
      return {};
    }

    // Local authentication
    const users = userStorage.getUsers();
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      found = {
        id: 'user-' + Date.now(),
        email,
        full_name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
        plan: 'free',
        created_at: new Date().toISOString(),
      };
      userStorage.updateUser(found.id, found);
    }

    setUser({ id: found.id, email: found.email });
    setProfile(found);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    setLoading(false);
    return {};
  };

  const signup = async (email: string, password?: string, fullName?: string) => {
    setLoading(true);
    if (isRealSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, plan: 'free', role: 'user' },
        },
      });
      if (error) {
        setLoading(false);
        return { error: error.message };
      }
      if (data.user) {
        const newProf: Profile = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName,
          role: 'user',
          plan: 'free',
          created_at: new Date().toISOString(),
        };
        setUser({ id: data.user.id, email: data.user.email || '' });
        setProfile(newProf);
      }
      setLoading(false);
      return {};
    }

    // Local signup
    const newProf: Profile = {
      id: 'usr-' + Date.now(),
      email,
      full_name: fullName || email.split('@')[0],
      role: 'user',
      plan: 'free', // on signup auto-create profile with plan = 'free' as requested
      created_at: new Date().toISOString(),
    };

    userStorage.updateUser(newProf.id, newProf);
    setUser({ id: newProf.id, email: newProf.email });
    setProfile(newProf);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProf));
    setLoading(false);
    return {};
  };

  const loginWithGoogle = async () => {
    if (isRealSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' },
      });
    } else {
      await login('google.trader@gmail.com');
    }
  };

  const logout = async () => {
    if (isRealSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const resetPassword = async (email: string) => {
    if (isRealSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) return { error: error.message };
    }
    return {};
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    userStorage.updateUser(profile.id, updated);

    if (isRealSupabaseConfigured && supabase) {
      await supabase.from('profiles').update(updates).eq('id', profile.id);
    }
  };

  const upgradeToPro = () => {
    updateProfile({ plan: 'pro' });
    if (profile?.id) {
      referralStorage.attributeProUpgrade(profile.id, 'monthly');
    }
  };

  const downgradeToFree = () => {
    updateProfile({ plan: 'free' });
  };

  const switchRole = (role: UserRole) => {
    updateProfile({ role });
  };

  const plan: UserPlan = profile?.plan || 'free';
  const role: UserRole = profile?.role || 'user';
  const isPro = plan === 'pro';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        plan,
        role,
        isPro,
        isAdmin,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfile,
        upgradeToPro,
        downgradeToFree,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
