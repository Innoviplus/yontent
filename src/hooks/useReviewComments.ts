
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export const useReviewComments = (reviewId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const fetchComments = async () => {
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
        
      if (error) {
        throw error;
      }
      
      const transformedComments: Comment[] = (data || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: new Date(comment.created_at),
        user: {
          id: comment.user_id,
          username: comment.profiles?.username || 'Anonymous',
          avatar: comment.profiles?.avatar || undefined
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
  
  const addComment = async (content: string) => {
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You need to be logged in to comment');
        return;
      }
      
      const { data, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: userData.user.id,
          content
        })
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
        
      if (error) {
        throw error;
      }
      
      const newCommentData: Comment = {
        id: data.id,
        content: data.content,
        createdAt: new Date(data.created_at),
        user: {
          id: data.user_id,
          username: data.profiles?.username || 'Anonymous',
          avatar: data.profiles?.avatar || undefined
        }
      };
      
      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const refreshComments = () => {
    fetchComments();
  };
  
  useEffect(() => {
    fetchComments();
  }, [reviewId]);
  
  return {
    comments,
    loading,
    addComment,
    submitting,
    refreshComments,
    newComment,
    setNewComment
  };
};
