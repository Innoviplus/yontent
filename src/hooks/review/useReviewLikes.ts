
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReviewLikes = (review: Review | null, userId: string | undefined) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  
  const checkIfUserLiked = async () => {
    if (!userId || !review?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('review_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('review_id', review.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking if user liked review:', error);
        return;
      }
      
      setHasLiked(!!data);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };
  
  const handleLike = async (setReview: React.Dispatch<React.SetStateAction<Review | null>>) => {
    if (!userId || !review) {
      if (!userId) toast.error('Please login to like reviews');
      return;
    }
    
    try {
      setLikeLoading(true);
      
      if (hasLiked) {
        const { error: deleteLikeError } = await supabase
          .from('review_likes')
          .delete()
          .eq('user_id', userId)
          .eq('review_id', review.id);
          
        if (deleteLikeError) {
          throw deleteLikeError;
        }
        
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: Math.max(0, (review.likesCount || 0) - 1) })
          .eq('id', review.id);
          
        if (updateError) {
          throw updateError;
        }
        
        setHasLiked(false);
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: Math.max(0, (prev.likesCount || 0) - 1)
          };
        });
        
        toast.success('Review unliked');
      } else {
        const { error: insertLikeError } = await supabase
          .from('review_likes')
          .insert([{ user_id: userId, review_id: review.id }]);
          
        if (insertLikeError) {
          throw insertLikeError;
        }
        
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: (review.likesCount || 0) + 1 })
          .eq('id', review.id);
          
        if (updateError) {
          throw updateError;
        }
        
        setHasLiked(true);
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: (prev.likesCount || 0) + 1
          };
        });
        
        toast.success('Review liked!');
      }
    } catch (error: any) {
      console.error('Error liking/unliking review:', error);
      toast.error('Failed to update like status');
    } finally {
      setLikeLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId && review) {
      checkIfUserLiked();
    }
  }, [userId, review]);
  
  return { hasLiked, likeLoading, handleLike };
};
