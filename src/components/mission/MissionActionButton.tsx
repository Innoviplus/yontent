
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Mission } from '@/lib/types';

interface MissionActionButtonProps {
  mission: Mission;
  participating: boolean;
  participationStatus: string | null;
  isJoining: boolean;
  currentSubmissions: number;
  onJoinMission: () => void;
  onStartSubmission: () => void;
}

const MissionActionButton = ({
  mission,
  participating,
  participationStatus,
  isJoining,
  currentSubmissions,
  onJoinMission,
  onStartSubmission
}: MissionActionButtonProps) => {
  // Check if mission is still active
  const isActive = mission.status === 'ACTIVE' && (!mission.expiresAt || new Date() < mission.expiresAt);
  
  // Check if total submissions limit is reached
  const isAtSubmissionLimit = mission.totalMaxSubmissions && currentSubmissions >= mission.totalMaxSubmissions;

  if (!isActive) {
    return (
      <Button disabled className="w-full">
        Mission Inactive
      </Button>
    );
  }

  if (isAtSubmissionLimit) {
    return (
      <Button disabled className="w-full">
        Submission Limit Reached
      </Button>
    );
  }

  if (!participating) {
    return (
      <Button 
        onClick={onJoinMission} 
        disabled={isJoining} 
        className="w-full bg-brand-teal hover:bg-brand-teal/90"
      >
        {isJoining ? 'Joining...' : 'Join Mission'}
      </Button>
    );
  }

  if (participationStatus === 'JOINED') {
    return (
      <Button 
        onClick={onStartSubmission} 
        className="w-full bg-brand-teal hover:bg-brand-teal/90"
      >
        Join Mission
      </Button>
    );
  }

  if (participationStatus === 'PENDING') {
    return (
      <Button disabled className="w-full">
        Submission Under Review
      </Button>
    );
  }

  if (participationStatus === 'APPROVED') {
    return (
      <div className="flex items-center justify-center w-full p-3 bg-green-50 text-green-700 rounded-lg">
        <CheckCircle className="h-5 w-5 mr-2" />
        Mission Completed
      </div>
    );
  }

  if (participationStatus === 'REJECTED') {
    return (
      <Button onClick={onStartSubmission} variant="outline" className="w-full">
        Resubmit
      </Button>
    );
  }

  return null;
};

export default MissionActionButton;
