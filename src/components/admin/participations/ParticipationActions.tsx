
import { Button } from '@/components/ui/button';
import { Check, X, Search } from 'lucide-react';
import { Participation } from '@/hooks/admin/useParticipations';
import { useState } from 'react';

interface ParticipationActionsProps {
  participation: Participation;
  onStatusUpdate: (id: string, status: string, participation: Participation) => void;
  onReview: (participation: Participation) => void;
}

export const ParticipationActions = ({ 
  participation, 
  onStatusUpdate, 
  onReview 
}: ParticipationActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusUpdate = async (status: string) => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(participation.id, status, participation);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-2">
      {participation.status === 'PENDING' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate('APPROVED')}
            disabled={isUpdating}
          >
            <Check className="h-4 w-4 mr-1" />
            {isUpdating ? 'Processing...' : 'Approve'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStatusUpdate('REJECTED')}
            disabled={isUpdating}
          >
            <X className="h-4 w-4 mr-1" />
            {isUpdating ? 'Processing...' : 'Reject'}
          </Button>
        </>
      )}
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onReview(participation)}
      >
        <Search className="h-4 w-4 mr-1" />
        Review
      </Button>
    </div>
  );
};
