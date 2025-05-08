
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseLikeActionProps {
  reviewId?: string;
  likesCount: number;
  hasLiked: boolean;
  likeLoading: boolean;
  onLike: () => void;
}

export const useLikeAction = ({
  reviewId,
  likesCount,
  hasLiked,
  likeLoading,
  onLike
}: UseLikeActionProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like reviews');
      return;
    }
    
    if (!reviewId) {
      console.error('Review ID is missing');
      return;
    }
    
    if (isProcessing || likeLoading) {
      return; // Prevent multiple clicks
    }
    
    setIsProcessing(true);
    try {
      console.log('Starting like action for review:', reviewId);
      // Call the provided onLike function which handles the like/unlike action
      onLike();
    } catch (error) {
      console.error('Error processing like action:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    likesCount,
    hasLiked,
    likeLoading: likeLoading || isProcessing,
    handleLike
  };
};
