
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
    navigate(`/submit-review?edit=${reviewId}`);
  };
  
  const handleDelete = async () => {
    if (!reviewId) return;
    
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
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
