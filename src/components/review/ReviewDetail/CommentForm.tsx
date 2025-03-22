
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';

interface CommentFormProps {
  user: User | null;
  userProfile: any | null;
  newComment: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CommentForm = ({
  user,
  userProfile,
  newComment,
  onCommentChange,
  onSubmit,
  isSubmitting
}: CommentFormProps) => {
  if (!user) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600 mb-2">You need to log in to comment</p>
        <Link to="/login">
          <Button className="bg-brand-teal hover:bg-brand-teal/90">Log In</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={userProfile?.avatar || undefined} />
          <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
            {userProfile?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="resize-none mb-2"
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || !newComment.trim()}
              className="bg-brand-teal hover:bg-brand-teal/90"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
