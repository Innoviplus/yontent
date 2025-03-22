
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/lib/types';

type ProfileWithCounts = User & {
  completedReviews: number;
  completedMissions: number;
  extendedData?: any;
  followersCount?: number;
  followingCount?: number;
};

export const useDashboardProfile = (userId: string | undefined) => {
  const [user, setUser] = useState<ProfileWithCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const fetchUserProfile = async () => {
      try {
        // Fetch the user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        // Fetch review count separately
        const { count: reviewsCount, error: reviewsError } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'PUBLISHED');

        if (reviewsError) {
          console.error('Error fetching reviews count:', reviewsError);
        }

        // Fetch missions count separately
        const { count: missionsCount, error: missionsError } = await supabase
          .from('mission_participations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (missionsError) {
          console.error('Error fetching missions count:', missionsError);
        }

        // Transform the profile data to match the User type with counts
        const userWithCounts: ProfileWithCounts = {
          id: profile.id,
          username: profile.username || 'Anonymous',
          email: '', // Add a default empty string for email as it's required by User type
          avatar: profile.avatar || undefined,
          points: profile.points || 0,
          createdAt: new Date(profile.created_at), // Convert string date to Date object
          completedReviews: reviewsCount || 0,
          completedMissions: missionsCount || 0,
          isAdmin: false, // Default value for isAdmin
          extendedData: profile.extended_data || {},
          followersCount: profile.followers_count || 0,
          followingCount: profile.following_count || 0
        };

        setUser(userWithCounts);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return { user, loading };
};
