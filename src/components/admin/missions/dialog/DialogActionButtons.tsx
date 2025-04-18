
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface DialogActionButtonsProps {
  status: string;
  id: string;
  processingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onClose: () => void;
}

const DialogActionButtons: React.FC<DialogActionButtonsProps> = ({
  status,
  id,
  processingId,
  onApprove,
  onReject,
  onClose
}) => {
  if (status !== 'PENDING') {
    return null;
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="default" 
        onClick={() => {
          onApprove(id);
          onClose();
        }}
        disabled={!!processingId}
      >
        <Check className="h-4 w-4 mr-2" />
        Approve Submission
      </Button>
      <Button 
        variant="destructive" 
        onClick={() => {
          onReject(id);
          onClose();
        }}
        disabled={!!processingId}
      >
        <X className="h-4 w-4 mr-2" />
        Reject Submission
      </Button>
    </div>
  );
};

export default DialogActionButtons;
