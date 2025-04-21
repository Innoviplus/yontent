
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { signOut } from '@/services/auth/sessionAuth';
import { useAuth } from '@/contexts/AuthContext';

export const useAccountActions = (
  navigate: (path: string) => void
) => {
  const { toast } = useToast();
  const { user, signOut: authSignOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (!confirmed) return;
    
    try {
      // In a real application, this would typically be handled by a secure server-side function
      sonnerToast.info('Account deletion would be processed here. Signing you out for demo purposes.');
      await authSignOut();
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
      await authSignOut();
      sonnerToast.success("You have been logged out");
      navigate('/');
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
