
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
  
  // Fetch the current likes count from the database to ensure accuracy
  const fetchCurrentLikesCount = async () => {
    if (!review?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('likes_count')
        .eq('id', review.id)
        .single();
        
      if (error) {
        console.error('Error fetching current likes count:', error);
        return;
      }
      
      if (data) {
        console.log('Fetched current likes count from DB:', data.likes_count);
        setLocalLikesCount(data.likes_count || 0);
      }
    } catch (error) {
      console.error('Unexpected error fetching likes count:', error);
    }
  };
  
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
        
        // Critical fix: Ensure the likes_count is properly updated in the database
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
        
        // Critical fix: First get the current likes count from the database
        const { data: currentData, error: fetchError } = await supabase
          .from('reviews')
          .select('likes_count')
          .eq('id', review.id)
          .single();
          
        if (fetchError) {
          console.error('Error fetching current likes count:', fetchError);
          throw fetchError;
        }
        
        // Use the database value to ensure accuracy
        const currentCount = currentData?.likes_count || 0;
        const newLikesCount = currentCount + 1;
        
        console.log('Current likes count in DB:', currentCount);
        console.log('Updating review likes count to:', newLikesCount);
        
        // Update the likes count in the database
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
      
      // After like/unlike action, refetch the current likes count from the database
      await fetchCurrentLikesCount();
      
    } catch (error: any) {
      console.error('Error liking/unliking review:', error);
      toast.error('Failed to update like status');
      
      // In case of error, refresh the likes count and status
      await fetchCurrentLikesCount();
      await checkIfUserLiked();
    } finally {
      setLikeLoading(false);
    }
  };
  
  // Check if the user has liked the review when the component mounts
  useEffect(() => {
    if (userId && review) {
      checkIfUserLiked();
      fetchCurrentLikesCount();
    }
  }, [userId, review]);
  
  return { hasLiked, likeLoading, likesCount: localLikesCount, handleLike };
};
