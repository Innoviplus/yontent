
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Comment } from '@/hooks/useReviewComments';

interface CommentsListProps {
  comments: Comment[];
  loading: boolean;
}

const CommentsList = ({ comments, loading }: CommentsListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet. Be the first to leave a comment!
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mb-8">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Link to={`/user/${comment.user.username}`}>
            <Avatar>
              <AvatarImage src={comment.user.avatar || undefined} />
              <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                {comment.user.username[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <Link to={`/user/${comment.user.username}`} className="font-medium hover:text-brand-teal">
                {comment.user.username}
              </Link>
              <span className="text-xs text-gray-500 ml-2">
                {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
