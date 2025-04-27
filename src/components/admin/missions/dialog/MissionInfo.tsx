
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Mission } from '@/lib/types';
import { ArrowRight, Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MissionDatesEditor from './MissionDatesEditor';

interface MissionInfoProps {
  mission: Mission;
  onMissionUpdated: () => Promise<void>;
}

const MissionInfo = ({ mission, onMissionUpdated }: MissionInfoProps) => {
  const [isEditingDates, setIsEditingDates] = useState(false);

  const handleDateUpdateComplete = async () => {
    setIsEditingDates(false);
    await onMissionUpdated();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Points</h3>
          <p className="mt-1 text-base font-medium">{mission.pointsReward} points</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Type</h3>
          <p className="mt-1 text-base font-medium capitalize">{mission.type.toLowerCase()}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2"
            onClick={() => setIsEditingDates(!isEditingDates)}
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">{isEditingDates ? 'Cancel' : 'Edit Dates'}</span>
          </Button>
        </div>
        
        {isEditingDates ? (
          <MissionDatesEditor
            missionId={mission.id}
            startDate={mission.startDate}
            expiryDate={mission.expiresAt}
            onSave={handleDateUpdateComplete}
            onCancel={() => setIsEditingDates(false)}
          />
        ) : (
          <div className="mt-2 flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>{format(mission.startDate, 'MMM d, yyyy')}</span>
            <ArrowRight className="mx-2 h-3.5 w-3.5 text-gray-400" />
            <span>
              {mission.expiresAt 
                ? format(mission.expiresAt, 'MMM d, yyyy')
                : 'No expiration date'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Max Per User</h3>
          <p className="mt-1 text-base font-medium">
            {mission.maxSubmissionsPerUser || 1}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Limit</h3>
          <p className="mt-1 text-base font-medium">
            {mission.totalMaxSubmissions || 'No limit'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionInfo;
