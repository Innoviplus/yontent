
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

export const useReviewComments = (reviewId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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
          profiles (
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
          id: comment.profiles?.id || '',
          username: comment.profiles?.username || '',
          avatar: comment.profiles?.avatar
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
  
  const handleSubmitComment = async (user: SupabaseUser | null) => {
    if (!user || !reviewId || !newComment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // First, add the comment
      const { data: commentData, error: commentError } = await supabase
        .from('review_comments')
        .insert([
          {
            review_id: reviewId,
            user_id: user.id,
            content: newComment.trim()
          }
        ])
        .select()
        .single();
        
      if (commentError) throw commentError;
      
      // Then, get the user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      const newCommentObj: Comment = {
        id: commentData.id,
        content: commentData.content,
        created_at: commentData.created_at,
        user: {
          id: profileData.id,
          username: profileData.username || '',
          avatar: profileData.avatar
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
  
  return {
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    loading,
    handleSubmitComment
  };
};
