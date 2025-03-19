
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Mission } from '@/lib/types';
import MissionCard from '@/components/MissionCard';

interface ActiveMissionsSectionProps {
  missions: Mission[];
}

const ActiveMissionsSection = ({ missions }: ActiveMissionsSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="chip chip-primary mb-2">Earn Points</div>
            <h2 className="heading-2">Active Missions</h2>
          </div>
          <Link to="/missions" className="flex items-center text-brand-slate hover:text-brand-lightSlate transition-colors">
            <span className="font-medium">View all</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveMissionsSection;
