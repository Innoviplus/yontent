import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { extractAvatarUrl } from '@/hooks/admin/api/types/participationTypes';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  username: string;
  userPoints: number;
  userAvatar: string | null;
}

export const useReviewComments = (reviewId: string) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  
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
        userId: comment.user_id,
        username: comment.profiles?.username || 'Anonymous',
        userPoints: comment.profiles?.points || 0,
        userAvatar: extractAvatarUrl(comment.profiles?.extended_data)
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
    if (!user) {
      toast.error('You must be logged in to comment');
      return false;
    }
    
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: user.id,
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
        userId: data.user_id,
        username: data.profiles?.username || 'Anonymous',
        userPoints: data.profiles?.points || 0,
        userAvatar: extractAvatarUrl(data.profiles?.extended_data)
      };
      
      setComments(prev => [...prev, newComment]);
      toast.success('Comment added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (reviewId) {
      fetchComments();
    }
  }, [reviewId]);
  
  return { comments, loading, addComment, submitting, refreshComments: fetchComments };
};
