
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export const useAccountActions = (
  user: any,
  signOut: () => Promise<void>,
  navigate: (path: string) => void
) => {
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    
    if (!confirmed) return;
    
    try {
      // In a real application, this would typically be handled by a secure server-side function
      sonnerToast.info('Account deletion would be processed here. Signing you out for demo purposes.');
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
