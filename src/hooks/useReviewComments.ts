
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
          profiles (
            id,
            username,
            avatar
          )
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching comments:', error);
        throw error;
      }
      
      if (!data) {
        setComments([]);
        return;
      }
      
      const transformedComments: Comment[] = data.map(comment => {
        // Safely handle the profiles data which might be null or have errors
        const profile = comment.profiles as any; // Cast to any to safely access properties
        return {
          id: comment.id,
          content: comment.content,
          createdAt: new Date(comment.created_at),
          user: {
            id: comment.user_id,
            username: profile && typeof profile === 'object' ? profile.username || 'Anonymous' : 'Anonymous',
            avatar: profile && typeof profile === 'object' ? profile.avatar : undefined
          }
        };
      });
      
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
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        toast.error('You need to be logged in to comment');
        return;
      }
      
      // First get the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .eq('id', userData.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Could not verify user profile');
      }
      
      // Now insert the comment
      const { data, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: userData.user.id,
          content
        })
        .select('id, content, created_at')
        .single();
        
      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
      
      // Create a new comment object with the profile data we fetched earlier
      const newCommentData: Comment = {
        id: data.id,
        content: data.content,
        createdAt: new Date(data.created_at),
        user: {
          id: profileData.id,
          username: profileData.username || 'Anonymous',
          avatar: profileData.avatar
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
    if (reviewId) {
      fetchComments();
    }
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
