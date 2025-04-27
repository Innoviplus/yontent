
import { Button } from '@/components/ui/button';
import { Check, X, Search } from 'lucide-react';
import { Participation } from '@/hooks/admin/useParticipations';

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
  return (
    <div className="flex gap-2">
      {participation.status === 'PENDING' && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusUpdate(participation.id, 'APPROVED', participation)}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusUpdate(participation.id, 'REJECTED', participation)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
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
