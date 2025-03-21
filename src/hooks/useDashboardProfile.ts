
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDashboardProfile = (userId: string | undefined) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
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

        // Fetch review count
        const { count: reviewsCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('status', 'PUBLISHED');

        // Fetch missions count
        const { count: missionsCount } = await supabase
          .from('mission_participations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

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
