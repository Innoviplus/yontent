
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

interface ReviewCommentsProps {
  reviewId: string;
}

const ReviewComments = ({ reviewId }: ReviewCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  const fetchComments = async () => {
    if (!reviewId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      const transformedComments = data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          id: comment.profiles.id,
          username: comment.profiles.username,
          avatar: comment.profiles.avatar
        }
      }));
      
      setComments(transformedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitComment = async () => {
    if (!user || !reviewId || !newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('review_comments')
        .insert([
          {
            review_id: reviewId,
            user_id: user.id,
            content: newComment.trim()
          }
        ])
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .single();
        
      if (error) throw error;
      
      const newCommentObj = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user: {
          id: data.profiles.id,
          username: data.profiles.username,
          avatar: data.profiles.avatar
        }
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, [reviewId]);
  
  return (
    <div className="bg-white rounded-xl shadow-subtle p-6">
      <h3 className="text-xl font-bold mb-6">Comments</h3>
      
      {loading ? (
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
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to leave a comment!
        </div>
      ) : (
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
      )}
      
      {user ? (
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
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none mb-2"
                rows={3}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-brand-teal hover:bg-brand-teal/90"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600 mb-2">You need to log in to comment</p>
          <Link to="/login">
            <Button className="bg-brand-teal hover:bg-brand-teal/90">Log In</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewComments;
