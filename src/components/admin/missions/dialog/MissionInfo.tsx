
import React from 'react';
import { Award, Tag } from 'lucide-react';
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
    <div className="border rounded-md p-4 bg-muted/30">
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex items-center">
          <Award className="h-4 w-4 mr-2 text-brand-teal" />
          <span>Reward: </span>
          <PointsBadge points={pointsReward || 0} size="sm" className="ml-1" />
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          <span>Type: {missionType === 'RECEIPT' ? 'Receipt Submission' : 'Review'}</span>
        </div>
      </div>
    </div>
  );
};

export default MissionInfo;
