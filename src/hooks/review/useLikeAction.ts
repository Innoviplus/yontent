
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { likeReview, checkIfLiked } from '@/services/review';
import { clearReviewsCache } from '@/services/review';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLikeAction = (reviewId: string | undefined, initialLikesCount = 0) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log(`useLikeAction initialized for review ${reviewId} with initial count:`, initialLikesCount);
  
  // Function to fetch the actual likes count from the database
  const fetchActualLikesCount = async () => {
    if (!reviewId) return;
    
    try {
      const { count, error } = await supabase
        .from('review_likes')
        .select('*', { count: 'exact', head: false })
        .eq('review_id', reviewId);
      
      if (!error && count !== null) {
        console.log(`Actual likes count from database for review ${reviewId}: ${count}`);
        setLikesCount(count);
        
        // Update the reviews table if needed
        await supabase
          .from('reviews')
          .update({ likes_count: count })
          .eq('id', reviewId);
      }
    } catch (err) {
      console.error('Error fetching actual likes count:', err);
    }
  };
  
  // Check if the user has already liked this review
  useEffect(() => {
    if (!reviewId || !user) return;
    
    const checkLikeStatus = async () => {
      try {
        const liked = await checkIfLiked(reviewId, user.id);
        console.log(`User ${user.id} has liked review ${reviewId}:`, liked);
        setIsLiked(liked);
        
        // Get accurate likes count
        await fetchActualLikesCount();
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    
    checkLikeStatus();
  }, [reviewId, user]);
  
  // Initialize likesCount from props when it changes
  useEffect(() => {
    if (initialLikesCount !== undefined) {
      console.log(`Updating likes count state from props:`, initialLikesCount);
      setLikesCount(initialLikesCount);
      
      // Verify with actual database count to ensure accuracy
      fetchActualLikesCount();
    }
  }, [initialLikesCount]);
  
  const handleLike = async () => {
    if (!reviewId || !user) {
      toast.error('You must be logged in to like reviews');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // The likeReview function toggles the like status and returns the new state
      const newLikedState = await likeReview(reviewId, user.id);
      
      // Update the local like state
      setIsLiked(newLikedState);
      
      // Fetch the actual count instead of optimistically updating
      await fetchActualLikesCount();
      
      // Clear the cache to ensure fresh data is fetched next time
      clearReviewsCache();
      
    } catch (error) {
      console.error('Error handling like action:', error);
      toast.error('Failed to process like action');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLiked,
    likesCount,
    handleLike,
    isLoading
  };
};
