
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Mission } from '@/lib/types';

interface UseMissionParticipationProps {
  mission: Mission;
  userId: string;
  onParticipationUpdate: (isParticipating: boolean, status: string) => void;
}

export const useMissionParticipation = ({
  mission,
  userId,
  onParticipationUpdate
}: UseMissionParticipationProps) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinMission = async () => {
    if (!userId) {
      toast.error('You must be logged in to join missions');
      return;
    }

    // For all mission types, navigate directly to submission page
    if (mission.type === 'REVIEW') {
      navigate(`/mission/${mission.id}/review`);
      return;
    }
    if (mission.type === 'RECEIPT') {
      navigate(`/mission/${mission.id}/receipt`);
      return;
    }

    // For SOCIAL_PROOF missions, create JOINED status first, then navigate
    if (mission.type === 'SOCIAL_PROOF') {
      setIsJoining(true);
      try {
        // Check if user is already participating
        const {
          data: existingParticipation,
          error: checkError
        } = await supabase.from('mission_participations').select('id, status').eq('mission_id', mission.id).eq('user_id_p', userId).single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }
        
        if (existingParticipation) {
          toast.info('You are already participating in this mission');
          onParticipationUpdate(true, existingParticipation.status);
          // Navigate to submission page if already joined
          if (existingParticipation.status === 'JOINED') {
            navigate(`/mission/${mission.id}/social-proof`);
          }
          return;
        }

        // Create participation record with JOINED status
        const {
          error: joinError
        } = await supabase.from('mission_participations').insert({
          mission_id: mission.id,
          user_id_p: userId,
          status: 'JOINED'
        });
        
        if (joinError) {
          throw joinError;
        }
        
        toast.success('Successfully joined the mission!');
        onParticipationUpdate(true, 'JOINED');

        // Navigate to social proof submission page
        navigate(`/mission/${mission.id}/social-proof`);
      } catch (error: any) {
        console.error('Error joining mission:', error);
        toast.error(error.message || 'Failed to join mission');
      } finally {
        setIsJoining(false);
      }
    }
  };

  const handleStartSubmission = () => {
    // Navigate to the appropriate submission page based on mission type
    if (mission.type === 'REVIEW') {
      navigate(`/mission/${mission.id}/review`);
    } else if (mission.type === 'RECEIPT') {
      navigate(`/mission/${mission.id}/receipt`);
    } else if (mission.type === 'SOCIAL_PROOF') {
      navigate(`/mission/${mission.id}/social-proof`);
    }
  };

  return {
    isJoining,
    handleJoinMission,
    handleStartSubmission
  };
};
