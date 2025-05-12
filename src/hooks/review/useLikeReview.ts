
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useLikeReview = (reviewId: string, initialLikesCount: number = 0) => {
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const { user } = useAuth();

  // Check if the current user has liked this review
  const checkUserLike = useCallback(async () => {
    if (!user?.id || !reviewId) return;
    
    try {
      const { data, error } = await supabase
        .from('review_likes')
        .select('id')
        .eq('user_id_likes', user.id)  // Using the renamed column
        .eq('review_id', reviewId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is the error for no rows returned
        console.error('Error checking like status:', error);
        return;
      }
      
      setUserHasLiked(!!data);
      console.log(`User ${user.id} has liked review ${reviewId}: ${!!data}`);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [user?.id, reviewId]);

  // Toggle like status (like or unlike)
  const toggleLike = async () => {
    if (!user?.id || !reviewId) {
      toast.error('You must be logged in to like reviews');
      return { liked: false, totalLikes: likesCount };
    }
    
    setIsLiking(true);
    
    try {
      if (userHasLiked) {
        // Unlike the review
        const { error } = await supabase
          .from('review_likes')
          .delete()
          .eq('user_id_likes', user.id)  // Using the renamed column
          .eq('review_id', reviewId);
          
        if (error) throw error;
        
        // Call the sync function to update the likes count
        const { data: syncResult, error: syncError } = await supabase
          .rpc('sync_review_likes_count', { review_id_param: reviewId });
        
        if (syncError) {
          console.error('Error syncing likes count:', syncError);
          throw syncError;
        }
        
        const newCount = syncResult || Math.max(0, likesCount - 1);
        setUserHasLiked(false);
        setLikesCount(newCount);
        
        console.log(`Unliked review ${reviewId}, new count: ${newCount}`);
        
        return { liked: false, totalLikes: newCount };
      } else {
        // Like the review
        const { error } = await supabase
          .from('review_likes')
          .insert({
            user_id_likes: user.id,  // Using the renamed column
            review_id: reviewId
          });
          
        if (error) {
          // If the error is because of a unique constraint violation, it means the user has already liked this post
          if (error.code === '23505') {
            setUserHasLiked(true);
            return { liked: true, totalLikes: likesCount };
          }
          throw error;
        }
        
        // Call the sync function to update the likes count
        const { data: syncResult, error: syncError } = await supabase
          .rpc('sync_review_likes_count', { review_id_param: reviewId });
        
        if (syncError) {
          console.error('Error syncing likes count:', syncError);
          throw syncError;
        }
        
        const newCount = syncResult || likesCount + 1;
        setUserHasLiked(true);
        setLikesCount(newCount);
        
        console.log(`Liked review ${reviewId}, new count: ${newCount}`);
        
        return { liked: true, totalLikes: newCount };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
      return { liked: userHasLiked, totalLikes: likesCount };
    } finally {
      setIsLiking(false);
    }
  };

  // Sync likes count with the database
  const syncLikesCount = async () => {
    try {
      const { data, error } = await supabase
        .rpc('sync_review_likes_count', { review_id_param: reviewId });
        
      if (error) {
        console.error('Error syncing likes count:', error);
        return;
      }
      
      if (data !== null && typeof data === 'number') {
        console.log(`Synced likes count for review ${reviewId}: ${data}`);
        setLikesCount(data);
      }
    } catch (error) {
      console.error('Error syncing likes count:', error);
    }
  };
  
  return {
    isLiking,
    likesCount,
    userHasLiked,
    toggleLike,
    checkUserLike,
    syncLikesCount,
    setLikesCount
  };
};
