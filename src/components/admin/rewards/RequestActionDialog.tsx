
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RedemptionRequest } from '@/lib/types';
import RequestDetailsCard from './RequestDetailsCard';
import BankDetailsSection from './BankDetailsSection';
import DialogFooterActions from './DialogFooterActions';

interface RequestActionDialogProps {
  request: RedemptionRequest;
  action: 'approve' | 'reject';
  onAction: (notes?: string) => Promise<boolean>;
  onCancel: () => void;
  onSaveNotes?: (notes: string) => Promise<boolean>;
}

const RequestActionDialog = ({ 
  request, 
  action, 
  onAction, 
  onCancel,
  onSaveNotes
}: RequestActionDialogProps) => {
  const [notes, setNotes] = useState<string>(request.adminNotes || '');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await onAction(notes);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsProcessing(true);
    try {
      if (onSaveNotes) {
        await onSaveNotes(notes);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isPending = request.status === 'PENDING';

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {action === 'approve' ? 'Approve Redemption Request' : 'Reject Redemption Request'}
          </DialogTitle>
          <DialogDescription>
            {action === 'approve' 
              ? 'Approve this request and mark it as processed.' 
              : 'Reject this request and return points to the user.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RequestDetailsCard request={request} />
          
          {request.paymentDetails && (
            <CardContent className="px-0 pt-4">
              <BankDetailsSection paymentDetails={request.paymentDetails} />
            </CardContent>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="text-sm font-medium mb-1.5 block">
              Admin Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Enter any notes or references for this action..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 mt-4">
          <DialogFooterActions 
            action={action}
            isPending={isPending}
            isProcessing={isProcessing}
            onSaveNotes={handleSaveNotes}
            onSubmit={handleSubmit}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestActionDialog;
