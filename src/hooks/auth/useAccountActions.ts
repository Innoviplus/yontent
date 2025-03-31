
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useUserDeletion } from '@/hooks/auth/useUserDeletion';

export const useAccountActions = (
  user: any,
  signOut: () => Promise<void>,
  navigate: (path: string) => void
) => {
  const { toast } = useToast();
  const { deleteUser } = useUserDeletion();

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (!confirmed) return;
    
    try {
      // Use our comprehensive deletion function
      const { error } = await deleteUser(user.id);
      
      if (error) {
        throw error;
      }
      
      // If successful, sign out the user
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Force refresh the page after logout to ensure clean state
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    handleDeleteAccount,
    handleLogout
  };
};
