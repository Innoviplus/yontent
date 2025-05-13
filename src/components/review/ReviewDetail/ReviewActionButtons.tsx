
import React from 'react';
import ShareButton from './buttons/ShareButton';
import EditButton from './buttons/EditButton';
import DeleteButton from './buttons/DeleteButton';
import { useShareAction } from '@/hooks/review/useShareAction';
import { useAuthorActions } from '@/hooks/review/useAuthorActions';

interface ReviewActionButtonsProps {
  isAuthor?: boolean;
  reviewId?: string;
}

const ReviewActionButtons = ({
  isAuthor = false,
  reviewId
}: ReviewActionButtonsProps) => {
  // Use our custom hooks
  const shareAction = useShareAction();
  const authorActions = useAuthorActions({ reviewId, isAuthor });
  
  return (
    <div className="flex items-center gap-2">
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
