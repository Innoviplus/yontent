
import { toast } from 'sonner';
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
  return {
    likesCount,
    hasLiked,
    likeLoading,
    handleLike: onLike
  };
};
