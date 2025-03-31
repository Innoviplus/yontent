
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
      
      // Then delete any redemption requests
      const { error: redemptionError } = await supabase
        .from('redemption_requests')
        .delete()
        .eq('user_id', userId);
        
      if (redemptionError) {
        console.error('Error deleting redemption requests:', redemptionError);
        throw redemptionError;
      }
      
      // Delete any review likes
      const { error: likesError } = await supabase
        .from('review_likes')
        .delete()
        .eq('user_id', userId);
        
      if (likesError) {
        console.error('Error deleting review likes:', likesError);
        throw likesError;
      }
      
      // Delete any review comments
      const { error: commentsError } = await supabase
        .from('review_comments')
        .delete()
        .eq('user_id', userId);
        
      if (commentsError) {
        console.error('Error deleting review comments:', commentsError);
        throw commentsError;
      }
      
      // Delete any reviews
      const { error: reviewsError } = await supabase
        .from('reviews')
        .delete()
        .eq('user_id', userId);
        
      if (reviewsError) {
        console.error('Error deleting reviews:', reviewsError);
        throw reviewsError;
      }
      
      // Delete any mission participations
      const { error: participationsError } = await supabase
        .from('mission_participations')
        .delete()
        .eq('user_id', userId);
        
      if (participationsError) {
        console.error('Error deleting mission participations:', participationsError);
        throw participationsError;
      }
      
      // Delete user follows where the user is a follower
      const { error: followerError } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', userId);
        
      if (followerError) {
        console.error('Error deleting follower relationships:', followerError);
        throw followerError;
      }
      
      // Delete user follows where the user is being followed
      const { error: followingError } = await supabase
        .from('user_follows')
        .delete()
        .eq('following_id', userId);
        
      if (followingError) {
        console.error('Error deleting following relationships:', followingError);
        throw followingError;
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

  // Function to delete all users (for admin or test purposes)
  const deleteAllUsers = async (userIds: string[]) => {
    const results = [];
    const errors = [];
    
    for (const userId of userIds) {
      try {
        const result = await deleteUser(userId);
        if (result.error) {
          errors.push({ userId, error: result.error });
        } else {
          results.push(userId);
        }
      } catch (error) {
        errors.push({ userId, error });
      }
    }
    
    if (errors.length === 0) {
      sonnerToast.success(`Successfully deleted ${results.length} users`);
    } else {
      sonnerToast.error(`Failed to delete ${errors.length} users. ${results.length} users were deleted successfully.`);
      console.error('Errors during bulk user deletion:', errors);
    }
    
    return { successful: results, errors };
  };

  return { deleteUser, deleteAllUsers };
}
