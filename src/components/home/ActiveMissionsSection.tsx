
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ActiveMissionsSectionProps {
  missions: Mission[];
}

const ActiveMissionsSection = ({ missions }: ActiveMissionsSectionProps) => {
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
          {missions.slice(0, 3).map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/login">
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
