
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Import our components
import MissionBanner from '@/components/mission/MissionBanner';
import MissionDetails from '@/components/mission/MissionDetails';
import MissionStats from '@/components/mission/MissionStats';
import MissionTerms from '@/components/mission/MissionTerms';
import MissionFAQ from '@/components/mission/MissionFAQ';
import SupportSection from '@/components/mission/SupportSection';
import MissionLoadingState from '@/components/mission/MissionLoadingState';
import { initializeMissionService } from '@/services/mission';

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Return early BEFORE any hooks if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<string | null>(null);
  const [currentSubmissions, setCurrentSubmissions] = useState<number>(0);
  const [totalSubmissions, setTotalSubmissions] = useState<number | undefined>(undefined);

  // Initialize the mission service on first render
  useEffect(() => {
    initializeMissionService();
  }, []);

  // Function to fetch participation count
  const fetchParticipationCount = async (missionId: string) => {
    try {
      console.log(`Fetching participation count for mission ${missionId}`);
      
      const { count, error } = await supabase
        .from('mission_participations')
        .select('*', { count: 'exact', head: true })
        .eq('mission_id', missionId);
        
      if (error) {
        throw error;
      }
      
      console.log(`Found ${count || 0} participations for mission ${missionId}`);
      setCurrentSubmissions(count || 0);
      return count;
    } catch (error) {
      console.error('Error fetching participation count:', error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchMission = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
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
          totalMaxSubmissions: data.total_max_submissions,
          termsConditions: data.terms_conditions || undefined,
          requirementDescription: data.requirement_description || undefined,
          startDate: new Date(data.start_date),
          expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          completionSteps: data.completion_steps || undefined,
          productDescription: data.product_description || undefined,
          productImages: data.product_images || [],
          faqContent: data.faq_content || undefined
        };
        
        setMission(transformedMission);
        setTotalSubmissions(data.total_max_submissions);
        
        if (user) {
          // Check user participation - Updated to use user_id_p instead of user_id
          const { data: participationData, error: participationError } = await supabase
            .from('mission_participations')
            .select('status')
            .eq('mission_id', id)
            .eq('user_id_p', user.id)
            .single();
            
          if (participationError && participationError.code !== 'PGRST116') {
            console.error('Error checking participation:', participationError);
          }
          
          if (participationData) {
            setParticipating(true);
            setParticipationStatus(participationData.status);
          }
          
          // Fetch the total participation count for this mission
          await fetchParticipationCount(id);
        }
      } catch (error) {
        console.error('Error fetching mission:', error);
        toast.error('Failed to load mission details');
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [id, user]);

  const handleParticipationUpdate = (isParticipating: boolean, status: string) => {
    setParticipating(isParticipating);
    setParticipationStatus(status);
    
    // Also update the current submissions count when a new participation is added
    if (isParticipating && !participating) {
      setCurrentSubmissions(prevCount => prevCount + 1);
    }
  };

  if (loading) {
    return <MissionLoadingState type="loading" />;
  }

  if (!mission) {
    return <MissionLoadingState type="notFound" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <MissionBanner mission={mission} />
      
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <MissionDetails mission={mission} />
              <MissionStats 
                mission={mission} 
                participating={participating} 
                participationStatus={participationStatus}
                userId={user.id}
                onParticipationUpdate={handleParticipationUpdate}
                currentSubmissions={currentSubmissions}
              />
            </div>
            
            <div className="space-y-6">
              <SupportSection />
              {mission.faqContent && <MissionFAQ faqContent={mission.faqContent} />}
            </div>
          </div>
        </div>
      </div>
      
      {mission.termsConditions && (
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <MissionTerms termsConditions={mission.termsConditions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDetail;
