
import React, { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Check, X } from 'lucide-react';
import { updateMissionDates } from '@/services/mission/updateMissionDates';

interface MissionDatesEditorProps {
  missionId: string;
  startDate: Date;
  expiryDate?: Date | null;
  onSave: () => void;
  onCancel: () => void;
}

const MissionDatesEditor = ({
  missionId,
  startDate: initialStartDate,
  expiryDate: initialExpiryDate,
  onSave,
  onCancel
}: MissionDatesEditorProps) => {
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [expiryDate, setExpiryDate] = useState<Date | null>(initialExpiryDate || null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const success = await updateMissionDates(missionId, startDate, expiryDate);
      if (success) {
        onSave();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 p-3 bg-gray-50 rounded-md border">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Start Date</label>
        <DatePicker 
          value={startDate} 
          onChange={(date) => date && setStartDate(date)}
          placeholder="Select start date" 
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Expiration Date (Optional)</label>
        <DatePicker 
          value={expiryDate} 
          onChange={setExpiryDate}
          placeholder="Select expiry date (optional)" 
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
          disabled={isUpdating}
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button 
          size="sm"
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 animate-spin" /> Updating...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-1" /> Update Dates
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MissionDatesEditor;
