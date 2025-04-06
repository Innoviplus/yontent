
import { useState } from 'react';
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
    loading,
    addComment,
    submitting,
    refreshComments,
    newComment,
    setNewComment
  } = useReviewComments(reviewId);
  
  const handleSubmitComment = () => {
    if (user) {
      addComment(newComment);
    }
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
          onSubmit={handleSubmitComment}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
};

export default ReviewComments;
