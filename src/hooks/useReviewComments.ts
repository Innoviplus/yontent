
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { extractAvatarUrl } from '@/hooks/admin/api/types/participationTypes';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    userId: string;
    username: string;
    points: number;
    avatar: string | null;
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
            username,
            points,
            extended_data
          )
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      const transformedComments = data.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: new Date(comment.created_at),
        user: {
          userId: comment.user_id,
          username: comment.profiles?.username || 'Anonymous',
          points: comment.profiles?.points || 0,
          avatar: extractAvatarUrl(comment.profiles?.extended_data)
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
  
  const handleSubmitComment = async (user: any) => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const result = await addComment(newComment);
      
      if (result) {
        setNewComment('');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  const addComment = async (content: string) => {
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id || ''),
          content: content.trim()
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            username,
            points,
            extended_data
          )
        `)
        .single();
        
      if (error) throw error;
      
      const newComment = {
        id: data.id,
        content: data.content,
        createdAt: new Date(data.created_at),
        user: {
          userId: data.user_id,
          username: data.profiles?.username || 'Anonymous',
          points: data.profiles?.points || 0,
          avatar: extractAvatarUrl(data.profiles?.extended_data)
        }
      };
      
      setComments(prev => [...prev, newComment]);
      toast.success('Comment added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
      return false;
    }
  };
  
  useEffect(() => {
    if (reviewId) {
      fetchComments();
    }
  }, [reviewId]);
  
  return { 
    comments, 
    loading, 
    submitting, 
    newComment, 
    setNewComment, 
    addComment, 
    handleSubmitComment, 
    refreshComments: fetchComments 
  };
};
