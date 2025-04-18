
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import MissionSortDropdown from '@/components/mission/MissionSortDropdown';
import Navbar from '@/components/Navbar';
import { RefreshCw, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

type SortOption = 'recent' | 'expiringSoon' | 'highestReward';

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [activeMissionsCount, setActiveMissionsCount] = useState(0);
  const isMobile = useIsMobile();

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('missions')
        .select('*')
        .eq('status', 'ACTIVE'); // Only fetch missions with ACTIVE status
      
      const { data, error } = await query;
      
      if (error) throw error;
      
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
        updatedAt: new Date(mission.updated_at)
      }));
      
      // Only count missions that aren't expired
      const now = new Date();
      const activeCount = transformedMissions.filter(
        mission => !mission.expiresAt || now <= mission.expiresAt
      ).length;
      
      setActiveMissionsCount(activeCount);
      
      // Sort the missions - first by expiration (expired at bottom), then by selected sort
      const sortedMissions = sortMissionsByExpiration(transformedMissions);
      setMissions(sortedMissions);
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Failed to load missions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Function to sort missions first by expiration (expired missions at the bottom)
  // and then by the user's selected sort criteria
  const sortMissionsByExpiration = (missionsToSort: Mission[]): Mission[] => {
    const now = new Date();
    return [...missionsToSort].sort((a, b) => {
      const aExpired = a.expiresAt && now > a.expiresAt;
      const bExpired = b.expiresAt && now > b.expiresAt;
      
      // First sort by expiration status
      if (aExpired && !bExpired) return 1; // Expired missions go at the bottom
      if (!aExpired && bExpired) return -1; // Active missions go at the top
      
      // If both have the same expiration status, sort by the selected criteria
      if (!aExpired && !bExpired) {
        switch (sortBy) {
          case 'recent':
            return b.startDate.getTime() - a.startDate.getTime();
          case 'expiringSoon':
            if (!a.expiresAt) return 1;
            if (!b.expiresAt) return -1;
            return a.expiresAt.getTime() - b.expiresAt.getTime();
          case 'highestReward':
            return b.pointsReward - a.pointsReward;
          default:
            return 0;
        }
      }
      
      // If both are expired, also sort them by the selected criteria
      switch (sortBy) {
        case 'recent':
          return b.startDate.getTime() - a.startDate.getTime();
        case 'expiringSoon':
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return a.expiresAt.getTime() - b.expiresAt.getTime();
        case 'highestReward':
          return b.pointsReward - a.pointsReward;
        default:
          return 0;
      }
    });
  };

  // When sort option changes, resort the missions without refetching
  useEffect(() => {
    setMissions(sortMissionsByExpiration([...missions]));
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="bg-white rounded-xl shadow-subtle p-6 mb-8">
          <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'} mb-4`}>
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-brand-teal" />
              <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
            </div>
            
            <p className="text-lg text-gray-600 mb-4">
              Complete missions to earn points and unlock rewards.
            </p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'justify-between items-center'}`}>
            <p className="text-gray-500 text-sm">
              {isLoading ? 'Loading missions...' : `${activeMissionsCount} active missions available`}
            </p>
            
            <div className="flex gap-2">
              <MissionSortDropdown 
                sortBy={sortBy} 
                onSortChange={setSortBy}
                className={isMobile ? 'w-full' : ''}
              />
              
              <button 
                className="flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={fetchMissions}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse h-72" />
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No available missions</h3>
            <p className="text-gray-600">
              There are no active missions at the moment. Check back soon for new opportunities to earn points!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} className="h-full" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Missions;
