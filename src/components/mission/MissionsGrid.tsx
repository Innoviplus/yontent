
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import { Skeleton } from '@/components/ui/skeleton';

interface MissionsGridProps {
  missions: Mission[];
  isLoading: boolean;
  getParticipationCount?: (missionId: string) => number;
}

const MissionsGrid = ({ missions, isLoading, getParticipationCount = () => 0 }: MissionsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(null).map((_, index) => (
          <Skeleton key={index} className="h-96 w-full" />
        ))}
      </div>
    );
  }
  
  if (missions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700">No Missions Available</h3>
        <p className="text-gray-500 mt-2">Check back later for new missions</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {missions.map(mission => (
        <MissionCard 
          key={mission.id} 
          mission={mission} 
          participationCount={getParticipationCount ? getParticipationCount(mission.id) : 0}
        />
      ))}
    </div>
  );
};

export default MissionsGrid;
