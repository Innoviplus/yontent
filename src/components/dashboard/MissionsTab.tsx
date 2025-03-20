
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MissionsTab = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserMissions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get the user's mission participations
        const { data: participations, error: participationsError } = await supabase
          .from('mission_participations')
          .select('mission_id, status')
          .eq('user_id', user.id);
        
        if (participationsError) throw participationsError;
        
        // Get all active missions
        const { data: missionsData, error: missionsError } = await supabase
          .from('missions')
          .select('*');
          
        if (missionsError) throw missionsError;
        
        // Transform the data to match the Mission type
        const transformedMissions: Mission[] = missionsData.map(mission => {
          // Check if user has participated in this mission
          const participation = participations?.find(p => p.mission_id === mission.id);
          
          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            pointsReward: mission.points_reward,
            type: mission.type as 'REVIEW' | 'RECEIPT',
            // If user has completed this mission, mark it as COMPLETED
            status: participation?.status === 'APPROVED' ? 'COMPLETED' : mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
            merchantName: mission.merchant_name || undefined,
            merchantLogo: mission.merchant_logo || undefined,
            bannerImage: mission.banner_image || undefined,
            maxSubmissionsPerUser: mission.max_submissions_per_user,
            termsConditions: mission.terms_conditions || undefined,
            requirementDescription: mission.requirement_description || undefined,
            startDate: new Date(mission.start_date),
            expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
            createdAt: new Date(mission.created_at),
            updatedAt: new Date(mission.updated_at)
          };
        });
        
        setMissions(transformedMissions);
      } catch (error) {
        console.error('Error fetching user missions:', error);
        toast.error('Failed to load missions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserMissions();
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse h-72" />
        ))}
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No active missions</h3>
        <p className="text-gray-600">
          You don't have any active missions at the moment. Check back soon for new opportunities to earn points!
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
};

export default MissionsTab;
