
import { Users, Clock, Target } from 'lucide-react';
import { Mission } from '@/lib/types';

interface MissionDetailsGridProps {
  mission: Mission;
  currentSubmissions: number;
}

const MissionDetailsGrid = ({ mission, currentSubmissions }: MissionDetailsGridProps) => {
  // Format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="flex items-center space-x-3">
        <Target className="h-5 w-5 text-brand-teal" />
        <div>
          <p className="text-sm text-gray-600">Mission Type</p>
          <p className="font-semibold">{mission.type.replace(/_/g, ' ').toUpperCase()}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Clock className="h-5 w-5 text-brand-teal" />
        <div>
          <p className="text-sm text-gray-600">Campaign Period</p>
          <p className="font-semibold">
            {formatDate(mission.startDate)} - {mission.expiresAt ? formatDate(mission.expiresAt) : 'No end date'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Users className="h-5 w-5 text-brand-teal" />
        <div>
          <p className="text-sm text-gray-600">Max submission(s) per user</p>
          <p className="font-semibold">{mission.maxSubmissionsPerUser || 1}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Target className="h-5 w-5 text-brand-teal" />
        <div>
          <p className="text-sm text-gray-600">Mission Quota</p>
          <p className="font-semibold">
            {mission.totalMaxSubmissions || 'Unlimited'} ({currentSubmissions} user{currentSubmissions !== 1 ? 's' : ''} submitted)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionDetailsGrid;
