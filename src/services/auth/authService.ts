
import { supabase } from '@/integrations/supabase/client';

// General auth utilities that don't fit in other specific auth service files

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error("Unexpected error getting session:", error);
    return null;
  }
};

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error("Unexpected error refreshing session:", error);
    return null;
  }
};
