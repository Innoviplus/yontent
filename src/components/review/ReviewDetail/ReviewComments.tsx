
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
    submitting,
    loading,
    handleSubmitComment
  } = useReviewComments(reviewId);
  
  const submitComment = () => {
    handleSubmitComment(user);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-subtle p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Comments</h3>
      
      <CommentsList comments={comments} loading={loading} />
      
      <div className="mt-6">
        <CommentForm
          user={user}
          userProfile={userProfile}
          newComment={newComment}
          onCommentChange={setNewComment}
          onSubmit={submitComment}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
};

export default ReviewComments;
