
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, CreditCard, User, Calendar } from 'lucide-react';
import { RedemptionRequest } from '@/lib/types';
import { format } from 'date-fns';

interface RequestActionDialogProps {
  request: RedemptionRequest;
  action: 'approve' | 'reject';
  onAction: (notes?: string) => Promise<boolean>;
  onCancel: () => void;
}

const RequestActionDialog = ({ 
  request, 
  action, 
  onAction, 
  onCancel 
}: RequestActionDialogProps) => {
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await onAction(notes);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasBankDetails = request.paymentDetails?.bank_details;

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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                Request Details
              </CardTitle>
              <CardDescription>
                Request submitted on {format(request.createdAt, 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Redemption Type</p>
                  <p className="text-base">{request.redemptionType === 'CASH' ? 'Cash Out' : 'Gift Voucher'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Points Amount</p>
                  <p className="text-base font-semibold">{request.pointsAmount} points</p>
                </div>
              </div>
              
              {request.paymentDetails?.reward_name && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Reward</p>
                  <p className="text-base">{request.paymentDetails.reward_name}</p>
                </div>
              )}
              
              {hasBankDetails && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Bank Account Details</p>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bank Name</p>
                        <p className="text-sm">{request.paymentDetails.bank_details.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Name</p>
                        <p className="text-sm">{request.paymentDetails.bank_details.account_name}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Number</p>
                        <p className="text-sm">{request.paymentDetails.bank_details.account_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">SWIFT Code</p>
                        <p className="text-sm">{request.paymentDetails.bank_details.swift_code || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Recipient Name</p>
                      <p className="text-sm">{request.paymentDetails.bank_details.recipient_name}</p>
                    </div>
                    
                    {request.paymentDetails.bank_details.recipient_address && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Recipient Address</p>
                        <p className="text-sm">{request.paymentDetails.bank_details.recipient_address}</p>
                      </div>
                    )}
                    
                    {request.paymentDetails.bank_details.recipient_mobile && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Recipient Mobile</p>
                        <p className="text-sm">{request.paymentDetails.bank_details.recipient_mobile}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
          {request.status === 'PENDING' ? (
            <>
              <Button
                type="button"
                variant={action === 'approve' ? 'default' : 'destructive'}
                onClick={handleSubmit}
                disabled={isProcessing}
                className="min-w-[100px]"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Processing
                  </>
                ) : action === 'approve' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={onCancel}>
              Save Notes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestActionDialog;
