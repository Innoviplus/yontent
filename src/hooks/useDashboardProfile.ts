
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import { Json } from '@/integrations/supabase/types';

// Define a specific type for the extended data to avoid deep recursion
type ExtendedData = Record<string, any>;

// Define a more explicit type to avoid deep recursion
type ProfileWithCounts = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  points: number;
  createdAt: Date;
  completedReviews: number;
  completedMissions: number;
  extendedData?: ExtendedData;
  followersCount?: number;
  followingCount?: number;
  transactionsCount?: number;
  website_url?: string; 
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  twitter_url?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  gender?: string;
  birth_date?: string;
  country?: string;
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
          .eq('user_id_p', userId);

        if (missionsError) {
          console.error('Error fetching missions count:', missionsError);
        }
        
        // Fetch point transactions count
        const { count: pointTransactionsCount, error: pointTransactionsError } = await supabase
          .from('point_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id_point', userId);
          
        if (pointTransactionsError) {
          console.error('Error fetching point transactions count:', pointTransactionsError);
        }
        
        // Fetch redemption requests count
        const { count: redemptionRequestsCount, error: redemptionRequestsError } = await supabase
          .from('redemption_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        if (redemptionRequestsError) {
          console.error('Error fetching redemption requests count:', redemptionRequestsError);
        }
        
        // Calculate total transactions count
        const totalTransactionsCount = (pointTransactionsCount || 0) + (redemptionRequestsCount || 0);

        // Convert Json to ExtendedData to avoid type issues
        const extendedData: ExtendedData = profile.extended_data 
          ? (profile.extended_data as ExtendedData)
          : {};

        // Transform the profile data to match the ProfileWithCounts type
        const userWithCounts: ProfileWithCounts = {
          id: profile.id,
          username: profile.username || 'Anonymous',
          email: profile.email || '', 
          avatar: profile.avatar || undefined,
          points: profile.points || 0,
          createdAt: new Date(profile.created_at),
          completedReviews: reviewsCount || 0,
          completedMissions: missionsCount || 0,
          extendedData: extendedData,
          followersCount: profile.followers_count || 0,
          followingCount: profile.following_count || 0,
          transactionsCount: totalTransactionsCount || 0
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
