
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Review } from '@/lib/types';

export const useUserProfile = (username: string | undefined) => {
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { user } = useAuth();
  
  const fetchUserProfile = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      setProfile(profileData);
      
      // Check if current user is following this profile
      if (user && profileData.id !== user.id) {
        setIsCurrentUser(false);
        const { data: followData } = await supabase
          .from('user_follows')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', profileData.id)
          .single();
          
        setIsFollowing(!!followData);
      } else if (user && profileData.id === user.id) {
        setIsCurrentUser(true);
      }
      
      // Fetch user's reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          views_count,
          likes_count,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });
      
      if (reviewsError) {
        throw reviewsError;
      }
      
      // Transform reviews
      const transformedReviews: Review[] = reviewsData.map((review: any) => ({
        id: review.id,
        userId: review.user_id,
        content: review.content,
        images: review.images || [],
        viewsCount: review.views_count,
        likesCount: review.likes_count,
        createdAt: new Date(review.created_at),
        user: review.profiles ? {
          id: review.profiles.id,
          username: review.profiles.username || 'Anonymous',
          email: '', // Not returned for privacy
          points: 0, // Not relevant in this context
          createdAt: new Date(), // Not relevant in this context
          avatar: review.profiles.avatar
        } : undefined
      }));
      
      setReviews(transformedReviews);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFollow = async () => {
    if (!user || !profile) {
      toast.error('You must be logged in to follow users');
      return;
    }
    
    if (user.id === profile.id) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.id);
          
        if (error) throw error;
        
        setIsFollowing(false);
        toast.success(`You unfollowed ${profile.username}`);
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert([
            { follower_id: user.id, following_id: profile.id }
          ]);
          
        if (error) throw error;
        
        setIsFollowing(true);
        toast.success(`You are now following ${profile.username}`);
      }
      
      // Refresh profile to get updated counts
      fetchUserProfile();
    } catch (error: any) {
      console.error('Error following/unfollowing user:', error);
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  return {
    profile,
    reviews,
    loading,
    isFollowing,
    isCurrentUser,
    followLoading,
    handleFollow,
    user
  };
};
