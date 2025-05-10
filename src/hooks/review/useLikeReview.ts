
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useLikeReview = (reviewId: string, initialLikesCount: number = 0) => {
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const { user } = useAuth();

  // Check if the current user has liked this review
  const checkUserLike = async () => {
    if (!user?.id || !reviewId) return;
    
    try {
      const { data, error } = await supabase
        .from('review_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('review_id', reviewId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is the error for no rows returned
        console.error('Error checking like status:', error);
        return;
      }
      
      setUserHasLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

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
          .eq('user_id', user.id)
          .eq('review_id', reviewId);
          
        if (error) throw error;
        
        // Decrement likes count
        await supabase.rpc('decrement_review_likes', { review_id_param: reviewId });
        
        setUserHasLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        return { liked: false, totalLikes: Math.max(0, likesCount - 1) };
      } else {
        // Like the review
        const { error } = await supabase
          .from('review_likes')
          .insert({
            user_id: user.id,
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
        
        // Increment likes count
        await supabase.rpc('increment_review_likes', { review_id_param: reviewId });
        
        setUserHasLiked(true);
        setLikesCount(prev => prev + 1);
        
        return { liked: true, totalLikes: likesCount + 1 };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
      return { liked: userHasLiked, totalLikes: likesCount };
    } finally {
      setIsLiking(false);
    }
  };

  // Call checkUserLike when needed (can be called in useEffect in the component)
  
  return {
    isLiking,
    likesCount,
    userHasLiked,
    toggleLike,
    checkUserLike,
    setLikesCount
  };
};
