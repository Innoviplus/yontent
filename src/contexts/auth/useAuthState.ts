
import { useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  return {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    userProfile,
    setUserProfile,
  };
}
