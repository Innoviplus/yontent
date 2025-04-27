
import React from 'react';
import { Award } from 'lucide-react';
import PointsBadge from '@/components/PointsBadge';

interface MissionInfoProps {
  title: string;
  description: string;
  pointsReward: number;
  missionType: string;
}

const MissionInfo: React.FC<MissionInfoProps> = ({
  title,
  description,
  pointsReward,
  missionType
}) => {
  return (
    <div className="bg-muted/30 p-4 rounded-md">
      <div className="flex justify-between mb-2">
        <h4 className="font-medium">Mission Info</h4>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-600" />
          <PointsBadge points={pointsReward} size="sm" />
        </div>
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-2">{description}</p>
      <p className="text-xs text-muted-foreground">
        Mission Type: {missionType === 'RECEIPT' ? 'Receipt Submission' : 'Review'}
      </p>
    </div>
  );
};

export default MissionInfo;
