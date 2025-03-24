
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
    if (reviewId) {
      navigate(`/edit-review/${reviewId}`);
    }
  };
  
  const handleDelete = async () => {
    if (!reviewId) return;
    
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        // With the ON DELETE CASCADE constraints now in place,
        // we can directly delete the review without manually deleting related records
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId);
          
        if (error) throw error;
        
        toast.success('Review deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review. Please try again.');
      }
    }
  };

  return {
    isAuthor,
    handleEdit,
    handleDelete
  };
};
