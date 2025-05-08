
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReviewLikes = (review: Review | null, userId: string | undefined) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);
  
  // Initialize and sync the likes count from the review
  useEffect(() => {
    if (review) {
      console.log('Setting initial likes count:', review.likesCount);
      setLocalLikesCount(review.likesCount || 0);
    }
  }, [review]);
  
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
      
      const userHasLiked = !!data;
      console.log('User has liked this review:', userHasLiked);
      setHasLiked(userHasLiked);
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
      console.log('Processing like action for review:', review.id);
      
      if (hasLiked) {
        // Unlike the review
        console.log('Removing like...');
        const { error: deleteLikeError } = await supabase
          .from('review_likes')
          .delete()
          .eq('user_id', userId)
          .eq('review_id', review.id);
          
        if (deleteLikeError) {
          console.error('Error removing like:', deleteLikeError);
          throw deleteLikeError;
        }
        
        const newLikesCount = Math.max(0, localLikesCount - 1);
        console.log('Updating review likes count to:', newLikesCount);
        
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: newLikesCount })
          .eq('id', review.id);
          
        if (updateError) {
          console.error('Error updating review likes count:', updateError);
          throw updateError;
        }
        
        setHasLiked(false);
        setLocalLikesCount(newLikesCount);
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: newLikesCount
          };
        });
        
        toast.success('Review unliked');
      } else {
        // Like the review
        console.log('Adding like...');
        const { error: insertLikeError } = await supabase
          .from('review_likes')
          .insert([{ user_id: userId, review_id: review.id }]);
          
        if (insertLikeError) {
          console.error('Error adding like:', insertLikeError);
          throw insertLikeError;
        }
        
        const newLikesCount = localLikesCount + 1;
        console.log('Updating review likes count to:', newLikesCount);
        
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ likes_count: newLikesCount })
          .eq('id', review.id);
          
        if (updateError) {
          console.error('Error updating review likes count:', updateError);
          throw updateError;
        }
        
        setHasLiked(true);
        setLocalLikesCount(newLikesCount);
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: newLikesCount
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
  
  // Check if the user has liked the review when the component mounts
  useEffect(() => {
    if (userId && review) {
      checkIfUserLiked();
    }
  }, [userId, review]);
  
  return { hasLiked, likeLoading, likesCount: localLikesCount, handleLike };
};
