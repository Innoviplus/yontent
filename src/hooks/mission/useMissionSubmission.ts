
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';

export const useMissionSubmission = (
  id: string | undefined, 
  missionType: 'REVIEW' | 'RECEIPT'
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
          .eq('user_id', user.id);
          
        if (participationError) throw participationError;
        
        // If user has already submitted, redirect to mission detail page
        if (participations && participations.length > 0) {
          toast.info(`You have already submitted a ${missionType.toLowerCase()} for this mission`);
          navigate(`/mission/${id}`);
          return;
        }
        
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
        
        const transformedMission: Mission = {
          id: data.id,
          title: data.title,
          description: data.description,
          pointsReward: data.points_reward,
          type: data.type as 'REVIEW' | 'RECEIPT',
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
          updatedAt: new Date(data.updated_at)
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
