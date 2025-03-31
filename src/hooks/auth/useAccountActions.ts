
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
      // First, delete related point transactions
      const { error: pointsError } = await supabase
        .from('point_transactions')
        .delete()
        .eq('user_id', user.id);
        
      if (pointsError) {
        console.error('Error deleting point transactions:', pointsError);
        throw pointsError;
      }
      
      // Delete any other related data...
      // (Example: you might need to delete other related records)
      
      // In a real application with proper admin privileges, use admin API
      // For now, sign out the user
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
