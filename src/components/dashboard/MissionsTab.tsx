
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';

interface MissionsTabProps {
  missions: Mission[];
}

const MissionsTab = ({ missions }: MissionsTabProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Missions</h2>
        <Link 
          to="/missions" 
          className="btn-primary py-1.5 px-4 text-sm"
        >
          Explore Missions
        </Link>
      </div>
      
      {missions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No missions yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't participated in any missions yet.
            Complete missions to earn additional points!
          </p>
          <Link to="/missions" className="btn-primary">
            Browse Available Missions
          </Link>
        </div>
      )}
    </>
  );
};

export default MissionsTab;
