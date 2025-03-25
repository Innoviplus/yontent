
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { RedemptionRequest } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface RequestRowActionsProps {
  request: RedemptionRequest;
  onApprove: (request: RedemptionRequest) => void;
  onReject: (request: RedemptionRequest) => void;
}

const RequestRowActions = ({ request, onApprove, onReject }: RequestRowActionsProps) => {
  if (request.status === 'PENDING') {
    return (
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-green-600 border-green-200 hover:bg-green-50"
          onClick={(e) => {
            e.stopPropagation();
            onApprove(request);
          }}
        >
          <Check className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onReject(request);
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>
    );
  }
  
  return (
    <span className="text-sm text-gray-500">
      {request.updatedAt && formatDistanceToNow(request.updatedAt, { addSuffix: true })}
    </span>
  );
};

export default RequestRowActions;
