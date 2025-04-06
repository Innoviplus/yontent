
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
      
      // Use a simpler join approach to avoid the relationship error
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          reviews!inner(id)
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
        return;
      }
      
      if (!data || data.length === 0) {
        setComments([]);
        setLoading(false);
        return;
      }
      
      // Fetch profile information separately
      const userIds = data.map(comment => comment.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast.error('Failed to load user profiles');
        return;
      }
      
      // Create a lookup map for quick profile access
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }
      
      // Transform the comments with profile data
      const transformedComments: Comment[] = data.map(comment => {
        const profile = profilesMap.get(comment.user_id);
        
        return {
          id: comment.id,
          content: comment.content,
          createdAt: new Date(comment.created_at),
          user: {
            id: comment.user_id,
            username: profile ? profile.username : 'Anonymous',
            avatar: profile ? profile.avatar : undefined
          }
        };
      });
      
      setComments(transformedComments);
    } catch (error) {
      console.error('Unexpected error fetching comments:', error);
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
