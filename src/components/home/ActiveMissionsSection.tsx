
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ActiveMissionsSection = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('status', 'ACTIVE')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        // Transform the data to match the Mission type
        const transformedMissions: Mission[] = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          description: mission.description,
          pointsReward: mission.points_reward,
          type: mission.type as 'REVIEW' | 'RECEIPT',
          status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
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
        }));
        
        // Filter out any expired missions
        const activeMissions = transformedMissions.filter(
          mission => !mission.expiresAt || new Date() < mission.expiresAt
        );
        
        setMissions(activeMissions);
      } catch (error) {
        console.error('Error fetching missions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Missions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete missions to earn points and unlock rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse h-72" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (missions.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Missions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete missions to earn points and unlock rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/missions">
            <Button className="bg-brand-teal hover:bg-brand-teal/90">
              See All Missions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActiveMissionsSection;
