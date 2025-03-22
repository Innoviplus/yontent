
import React from 'react';
import { Heart, Share2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReviewActionButtonsProps {
  likesCount: number;
  hasLiked: boolean;
  onLike: () => void;
  likeLoading: boolean;
  isAuthor?: boolean;
  reviewId?: string;
}

const ReviewActionButtons = ({
  likesCount,
  hasLiked,
  onLike,
  likeLoading,
  isAuthor = false,
  reviewId
}: ReviewActionButtonsProps) => {
  const navigate = useNavigate();
  
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };
  
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
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLike}
        disabled={likeLoading}
        className="text-gray-600"
      >
        <Heart 
          className={`h-5 w-5 mr-1 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} 
        />
        <span>{likesCount}</span>
      </Button>
      
      {isAuthor ? (
        <>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </>
      ) : null}
      
      <Button variant="ghost" size="sm" onClick={handleCopyLink}>
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ReviewActionButtons;
