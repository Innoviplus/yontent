
import React from 'react';
import LikeButton from './buttons/LikeButton';
import ShareButton from './buttons/ShareButton';
import EditButton from './buttons/EditButton';
import DeleteButton from './buttons/DeleteButton';
import { useLikeAction } from '@/hooks/review/useLikeAction';
import { useShareAction } from '@/hooks/review/useShareAction';
import { useAuthorActions } from '@/hooks/review/useAuthorActions';

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
  // Use our custom hooks
  const likeAction = useLikeAction({ reviewId, likesCount, hasLiked, likeLoading, onLike });
  const shareAction = useShareAction();
  const authorActions = useAuthorActions({ reviewId, isAuthor });
  
  return (
    <div className="flex items-center gap-2">
      <LikeButton 
        likesCount={likeAction.likesCount}
        hasLiked={likeAction.hasLiked}
        onClick={likeAction.handleLike}
        isLoading={likeAction.likeLoading}
      />
      
      {authorActions.isAuthor ? (
        <>
          <EditButton onClick={authorActions.handleEdit} />
          <DeleteButton onClick={authorActions.handleDelete} />
        </>
      ) : null}
      
      <ShareButton onClick={shareAction.handleCopyLink} />
    </div>
  );
};

export default ReviewActionButtons;
