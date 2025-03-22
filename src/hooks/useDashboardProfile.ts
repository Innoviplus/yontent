
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type ProfileWithCounts = Tables<'profiles'> & {
  completedReviews: number;
  completedMissions: number;
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

        // Combine the profile with the counts
        setUser({
          ...profile,
          completedReviews: reviewsCount || 0,
          completedMissions: missionsCount || 0
        });
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
