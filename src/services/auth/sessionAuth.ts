
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signOut = async (): Promise<void> => {
  console.log("sessionAuth: Calling signOut");
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error in sessionAuth signOut:", error);
    throw error;
  }
  console.log("sessionAuth: SignOut successful");
  toast.info('You have been signed out.');
};

// Note: getCurrentSession and getCurrentUser are now in authService.ts
// to avoid duplicate exports
export const getSessionUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
