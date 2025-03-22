
import { useAuth } from '@/contexts/AuthContext';
import { useReviewComments } from '@/hooks/useReviewComments';
import CommentsList from './CommentsList';
import CommentForm from './CommentForm';

interface ReviewCommentsProps {
  reviewId: string;
}

const ReviewComments = ({ reviewId }: ReviewCommentsProps) => {
  const { user, userProfile } = useAuth();
  const {
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    loading,
    handleSubmitComment
  } = useReviewComments(reviewId);
  
  const submitComment = () => {
    handleSubmitComment(user);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-subtle p-6">
      <h3 className="text-xl font-bold mb-6">Comments</h3>
      
      <CommentsList comments={comments} loading={loading} />
      
      <CommentForm
        user={user}
        userProfile={userProfile}
        newComment={newComment}
        onCommentChange={setNewComment}
        onSubmit={submitComment}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ReviewComments;
