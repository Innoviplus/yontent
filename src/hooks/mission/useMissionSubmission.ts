
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';

export const useMissionSubmission = (
  id: string | undefined, 
  missionType: 'REVIEW' | 'RECEIPT' | 'SOCIAL_PROOF'
) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMission = async () => {
      if (!id || !user) return;
      
      try {
        // Check if user has already submitted for this mission
        const { data: participations, error: participationError } = await supabase
          .from('mission_participations')
          .select('*')
          .eq('mission_id', id)
          .eq('user_id_p', user.id);
          
        if (participationError) throw participationError;
        
        // If user has already submitted, redirect to mission detail page
        if (participations && participations.length > 0) {
          toast.info(`You have already submitted a ${missionType.toLowerCase()} for this mission`);
          navigate(`/mission/${id}`);
          return;
        }
        
        // Check the mission quota - count ALL submissions regardless of status
        const { count: totalSubmissions, error: countError } = await supabase
          .from('mission_participations')
          .select('*', { count: 'exact', head: true })
          .eq('mission_id', id);
          
        if (countError) throw countError;
        
        console.log(`Total submissions for mission ${id}: ${totalSubmissions}`);
        
        // Fetch mission details
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', id)
          .eq('type', missionType)  // Ensure this is the correct mission type
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError(`${missionType} mission not found`);
          navigate('/missions');
          return;
        }
        
        // Check if the mission quota has been reached
        if (data.total_max_submissions && totalSubmissions && totalSubmissions >= data.total_max_submissions) {
          toast.error("This mission has reached its maximum number of submissions");
          navigate(`/mission/${id}`);
          return;
        }
        
        const transformedMission: Mission = {
          id: data.id,
          title: data.title,
          description: data.description,
          pointsReward: data.points_reward,
          type: data.type as 'REVIEW' | 'RECEIPT' | 'SOCIAL_PROOF',
          status: data.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
          merchantName: data.merchant_name || undefined,
          merchantLogo: data.merchant_logo || undefined,
          bannerImage: data.banner_image || undefined,
          maxSubmissionsPerUser: data.max_submissions_per_user,
          termsConditions: data.terms_conditions || undefined,
          requirementDescription: data.requirement_description || undefined,
          startDate: new Date(data.start_date),
          expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          totalMaxSubmissions: data.total_max_submissions
        };
        
        setMission(transformedMission);
      } catch (error) {
        console.error(`Error fetching ${missionType.toLowerCase()} mission:`, error);
        setError(`Failed to load mission details`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [id, user, navigate, missionType]);

  return { mission, isLoading, error };
};
