
import { Mission } from '@/lib/types';
import { useMissionParticipation } from '@/hooks/mission/useMissionParticipation';
import MissionStatusBadge from './MissionStatusBadge';
import MissionActionButton from './MissionActionButton';
import MissionDetailsGrid from './MissionDetailsGrid';

interface MissionStatsProps {
  mission: Mission;
  participating: boolean;
  participationStatus: string | null;
  userId: string;
  onParticipationUpdate: (isParticipating: boolean, status: string) => void;
  currentSubmissions: number;
}

const MissionStats = ({
  mission,
  participating,
  participationStatus,
  userId,
  onParticipationUpdate,
  currentSubmissions
}: MissionStatsProps) => {
  const { isJoining, handleJoinMission, handleStartSubmission } = useMissionParticipation({
    mission,
    userId,
    onParticipationUpdate
  });

  return (
    <div className="space-y-6">
      {/* Mission Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mission Details</h3>
          <MissionStatusBadge 
            participating={participating} 
            participationStatus={participationStatus} 
          />
        </div>
        
        <MissionDetailsGrid 
          mission={mission} 
          currentSubmissions={currentSubmissions} 
        />

        <MissionActionButton
          mission={mission}
          participating={participating}
          participationStatus={participationStatus}
          isJoining={isJoining}
          currentSubmissions={currentSubmissions}
          onJoinMission={handleJoinMission}
          onStartSubmission={handleStartSubmission}
        />
      </div>
    </div>
  );
};

export default MissionStats;
