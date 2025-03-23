
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthorActionsProps {
  reviewId?: string;
  isAuthor: boolean;
}

export const useAuthorActions = ({ reviewId, isAuthor }: UseAuthorActionsProps) => {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate(`/edit-review/${reviewId}`);
  };
  
  const handleDelete = async () => {
    if (!reviewId) return;
    
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        // First delete all related likes
        const { error: likesError } = await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId);
          
        if (likesError) throw likesError;
        
        // Then delete any comments
        const { error: commentsError } = await supabase
          .from('review_comments')
          .delete()
          .eq('review_id', reviewId);
          
        if (commentsError) throw commentsError;
        
        // Finally delete the review itself
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);
          
        if (error) throw error;
        
        toast.success('Review deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  return {
    isAuthor,
    handleEdit,
    handleDelete
  };
};
