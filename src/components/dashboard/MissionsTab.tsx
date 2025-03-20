
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';

interface MissionsTabProps {
  missions: Mission[];
}

const MissionsTab = ({ missions }: MissionsTabProps) => {
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
