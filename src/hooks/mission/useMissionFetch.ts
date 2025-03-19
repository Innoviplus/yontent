
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MissionFormData } from '@/lib/types';

export const useMissionFetch = (id: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMission = async (): Promise<MissionFormData | null> => {
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching mission:', error);
        throw error;
      }

      if (data) {
        return {
          title: data.title,
          description: data.description,
          requirementDescription: data.requirement_description,
          pointsReward: data.points_reward,
          type: data.type,
          status: data.status,
          merchantName: data.merchant_name || '',
          merchantLogo: data.merchant_logo || '',
          bannerImage: data.banner_image || '',
          maxSubmissionsPerUser: data.max_submissions_per_user || 1,
          termsConditions: data.terms_conditions || '',
          startDate: new Date(data.start_date),
          expiresAt: data.expires_at ? new Date(data.expires_at) : null,
        };
      }
      
      return null;
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to load mission details');
      console.error('Error fetching mission:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchMission,
    loading,
    error,
    setError
  };
};
