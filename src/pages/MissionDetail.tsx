
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Import our new components
import MissionBanner from '@/components/mission/MissionBanner';
import MissionDetails from '@/components/mission/MissionDetails';
import CommunityEngagement from '@/components/mission/CommunityEngagement';
import MissionTestimonials from '@/components/mission/MissionTestimonials';
import MissionStats from '@/components/mission/MissionStats';
import MissionFAQ from '@/components/mission/MissionFAQ';
import SupportSection from '@/components/mission/SupportSection';
import MissionLoadingState from '@/components/mission/MissionLoadingState';

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Return early BEFORE any hooks if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [participating, setParticipating] = useState(false);
  const [participationStatus, setParticipationStatus] = useState<string | null>(null);

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
          termsConditions: data.terms_conditions || undefined,
          requirementDescription: data.requirement_description || undefined,
          startDate: new Date(data.start_date),
          expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        };
        
        setMission(transformedMission);
        
        if (user) {
          const { data: participationData, error: participationError } = await supabase
            .from('mission_participations')
            .select('status')
            .eq('mission_id', id)
            .eq('user_id', user.id)
            .single();
            
          if (participationError && participationError.code !== 'PGRST116') {
            console.error('Error checking participation:', participationError);
          }
          
          if (participationData) {
            setParticipating(true);
            setParticipationStatus(participationData.status);
          }
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <MissionDetails mission={mission} />
            <CommunityEngagement />
            <MissionTestimonials />
          </div>
          
          <div className="space-y-6">
            <MissionStats 
              mission={mission} 
              participating={participating} 
              participationStatus={participationStatus}
              userId={user.id}
              onParticipationUpdate={handleParticipationUpdate}
            />
            <MissionFAQ />
            <SupportSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
