
import React from 'react';
import ShareButton from './buttons/ShareButton';
import EditButton from './buttons/EditButton';
import DeleteButton from './buttons/DeleteButton';
import LikeButton from './buttons/LikeButton';
import { useShareAction } from '@/hooks/review/useShareAction';
import { useAuthorActions } from '@/hooks/review/useAuthorActions';
import { useLikeAction } from '@/hooks/review/useLikeAction';

interface ReviewActionButtonsProps {
  isAuthor?: boolean;
  reviewId?: string;
  likesCount?: number;
}

const ReviewActionButtons = ({
  isAuthor = false,
  reviewId,
  likesCount = 0
}: ReviewActionButtonsProps) => {
  // Use our custom hooks
  const shareAction = useShareAction();
  const authorActions = useAuthorActions({ reviewId, isAuthor });
  const likeAction = useLikeAction(reviewId, likesCount);
  
  return (
    <div className="flex items-center gap-2">
      {/* Like button */}
      <LikeButton
        isLiked={likeAction.isLiked}
        likesCount={likeAction.likesCount}
        onClick={likeAction.handleLike}
        isLoading={likeAction.isLoading}
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
