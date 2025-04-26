
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import { useMissionsList } from '@/hooks/mission/useMissionsList';

interface MissionsGridProps {
  missions: Mission[];
  isLoading: boolean;
}

const MissionsGrid = ({ missions, isLoading }: MissionsGridProps) => {
  const { getParticipationCount } = useMissionsList();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse h-72" />
        ))}
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No available missions</h3>
        <p className="text-gray-600">
          There are no active missions at the moment. Check back soon for new opportunities to earn points!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {missions.map((mission) => (
        <MissionCard 
          key={mission.id} 
          mission={mission} 
          className="h-full" 
          participationCount={getParticipationCount(mission.id)}
        />
      ))}
    </div>
  );
};

export default MissionsGrid;
