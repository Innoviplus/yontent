
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export function useSignOut() {
  const signOut = async () => {
    try {
      console.log('Attempting to sign out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      console.log('User signed out successfully');
      sonnerToast.info('You have been signed out.');
      
      // Force a hard refresh to clear any cached state
      window.location.href = '/'; 
    } catch (error) {
      console.error('Failed to sign out:', error);
      sonnerToast.error('Failed to sign out. Please try again.');
    }
  };

  return { signOut };
}
