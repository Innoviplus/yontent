
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export function useSignOut() {
  const signOut = async () => {
    await supabase.auth.signOut();
    sonnerToast.info('You have been signed out.');
  };

  return { signOut };
}
