
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';

const ActiveMissionsSection = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participationCounts, setParticipationCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        console.log("Fetching missions for home page...");
        setIsLoading(true);
        setError(null);
        
        const {
          data,
          error
        } = await supabase
          .from('missions')
          .select('*')
          .eq('status', 'ACTIVE')
          .order('display_order', { ascending: true }) // First sort by display_order
          .order('created_at', { ascending: false })  // Then by creation date
          .limit(3);
          
        if (error) throw error;

        console.log(`Fetched ${data?.length || 0} missions for home page`);
        
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
          totalMaxSubmissions: mission.total_max_submissions,
          termsConditions: mission.terms_conditions || undefined,
          requirementDescription: mission.requirement_description || undefined,
          startDate: new Date(mission.start_date),
          expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
          createdAt: new Date(mission.created_at),
          updatedAt: new Date(mission.updated_at),
          displayOrder: mission.display_order || 0
        }));

        // Sort missions so expired ones are at the bottom, but respect display_order first
        const now = new Date();
        const sortedMissions = [...transformedMissions].sort((a, b) => {
          const aExpired = a.expiresAt && now > a.expiresAt;
          const bExpired = b.expiresAt && now > b.expiresAt;
          
          // First separate active from expired
          if (aExpired && !bExpired) return 1; // a is expired, b is not -> a goes after b
          if (!aExpired && bExpired) return -1; // a is not expired, b is -> a goes before b
          
          // Within the same category (active or expired), sort by display_order
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        });
        
        setMissions(sortedMissions);
        
        // Fetch participation counts for each mission
        if (sortedMissions.length > 0) {
          fetchParticipationCounts(sortedMissions.map(m => m.id));
        }
      } catch (error: any) {
        console.error('Error fetching home page missions:', error);
        setError(error?.message || 'Failed to load missions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMissions();
  }, []);

  // Function to fetch participation counts
  const fetchParticipationCounts = async (missionIds: string[]) => {
    if (!missionIds.length) return;
    
    try {
      // Make separate count requests for each mission
      const countPromises = missionIds.map(async (missionId) => {
        const { count, error } = await supabase
          .from('mission_participations')
          .select('*', { count: 'exact', head: true })
          .eq('mission_id', missionId);
          
        return { missionId, count: count || 0, error };
      });
      
      const results = await Promise.all(countPromises);
      
      // Convert results to a record object
      const counts: Record<string, number> = {};
      results.forEach(result => {
        if (result.error) {
          console.error(`Error counting participations for mission ${result.missionId}:`, result.error);
        }
        counts[result.missionId] = result.count;
      });
      
      console.log('Home page mission participation counts:', counts);
      setParticipationCounts(counts);
    } catch (error) {
      console.error('Error fetching participation counts for home page:', error);
    }
  };

  // If there's an error, show a message with retry button
  if (error) {
    return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading missions</h3>
              <p className="text-sm text-red-600 mt-1">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
  }

  if (isLoading) {
    return <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Missions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete missions to earn points and unlock rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse h-72" />)}
          </div>
        </div>
      </section>;
  }
  
  // If no missions, don't show the section at all
  if (missions.length === 0) {
    return null;
  }
  
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Active Missions</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
            Complete missions to earn points and unlock rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {missions.map(mission => (
            <MissionCard 
              key={mission.id} 
              mission={mission} 
              participationCount={participationCounts[mission.id] || 0}
            />
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
    </section>;
};

export default ActiveMissionsSection;
