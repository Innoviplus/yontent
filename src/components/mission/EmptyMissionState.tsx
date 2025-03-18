
import { Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyMissionStateProps {
  isAuthenticated: boolean;
}

const EmptyMissionState = ({ isAuthenticated }: EmptyMissionStateProps) => {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
      <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No missions available</h3>
      <p className="text-gray-600 mb-6">
        There are no active missions at the moment. Check back soon for new opportunities to earn points!
      </p>
      {isAuthenticated ? (
        <Link to="/dashboard">
          <Button className="bg-brand-teal hover:bg-brand-teal/90">
            Go to Dashboard
          </Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button className="bg-brand-teal hover:bg-brand-teal/90">
            Login to Join Missions
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyMissionState;
