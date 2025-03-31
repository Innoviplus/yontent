
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export function useUserDeletion() {
  const { toast } = useToast();

  const deleteUser = async (userId: string) => {
    try {
      // First, delete related point transactions to avoid foreign key constraint errors
      const { error: pointsError } = await supabase
        .from('point_transactions')
        .delete()
        .eq('user_id', userId);
        
      if (pointsError) {
        console.error('Error deleting point transactions:', pointsError);
        throw pointsError;
      }
      
      // Delete user from auth.users (this will cascade to profiles due to on delete cascade)
      const { error: userError } = await supabase.auth.admin.deleteUser(userId);
      
      if (userError) {
        console.error('Error deleting user:', userError);
        throw userError;
      }
      
      sonnerToast.success('User deleted successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast({
        title: "User Deletion Failed",
        description: error.message || "An unexpected error occurred while deleting the user.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return { deleteUser };
}
