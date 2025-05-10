
import { useAuthorActions } from '@/hooks/review/useAuthorActions';
import EditButton from './buttons/EditButton';
import DeleteButton from './buttons/DeleteButton';
import ShareButton from './buttons/ShareButton';
import LikeButton from './buttons/LikeButton';

interface ReviewActionButtonsProps {
  reviewId: string;
  isAuthor: boolean;
  likesCount?: number;
}

const ReviewActionButtons = ({ 
  reviewId, 
  isAuthor,
  likesCount = 0
}: ReviewActionButtonsProps) => {
  const { handleEdit, handleDelete } = useAuthorActions({ reviewId, isAuthor });
  
  return (
    <div className="flex items-center gap-4">
      {/* Like button (for all users) */}
      <LikeButton reviewId={reviewId} initialLikesCount={likesCount} />
      
      {/* Share button (for all users) */}
      <ShareButton reviewId={reviewId} />
      
      {/* Edit & Delete buttons (only for authors) */}
      {isAuthor && (
        <>
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </>
      )}
    </div>
  );
};

export default ReviewActionButtons;
