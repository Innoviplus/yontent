
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

export const useReviewComments = (reviewId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!reviewId) return;
    
    try {
      setLoading(true);
      
      // First get the comments without the join
      const { data, error } = await supabase
        .from('review_comments')
        .select('id, content, created_at, user_id')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Then fetch user profiles separately and map them to comments
      const commentWithProfiles = await Promise.all(
        data.map(async (comment) => {
          // Get profile data for each comment
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, avatar')
            .eq('id', comment.user_id)
            .single();
          
          // Return comment with user data
          return {
            id: comment.id,
            content: comment.content,
            createdAt: comment.created_at,
            user: {
              id: comment.user_id,
              username: profileError ? 'Anonymous' : (profileData?.username || 'Anonymous'),
              avatar: profileError ? null : profileData?.avatar
            }
          };
        })
      );
      
      setComments(commentWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };
  
  const addComment = async (content: string): Promise<boolean> => {
    if (!reviewId || !content.trim()) return false;
    
    try {
      setSubmitting(true);
      
      // First, add the comment
      const { data: commentData, error: commentError } = await supabase
        .from('review_comments')
        .insert([
          {
            review_id: reviewId,
            user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
            content: content.trim()
          }
        ])
        .select()
        .single();
        
      if (commentError) throw commentError;
      
      // Then, get the user profile data
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.warn('Could not fetch profile data:', profileError);
        // Continue with a fallback for the profile data
      }
      
      const newCommentObj: Comment = {
        id: commentData.id,
        content: commentData.content,
        createdAt: commentData.created_at,
        user: {
          id: userId,
          username: profileData?.username || 'Anonymous',
          avatar: profileData?.avatar
        }
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
      toast.success('Comment added successfully');
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  
  const refreshComments = async () => {
    await fetchComments();
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
