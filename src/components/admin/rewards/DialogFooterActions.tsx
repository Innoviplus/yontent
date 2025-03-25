
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface DialogFooterActionsProps {
  action: 'approve' | 'reject';
  isPending: boolean;
  isProcessing: boolean;
  onSaveNotes: () => void;
  onSubmit: () => void;
}

const DialogFooterActions = ({ 
  action, 
  isPending, 
  isProcessing, 
  onSaveNotes, 
  onSubmit 
}: DialogFooterActionsProps) => {
  if (isPending) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveNotes}
          disabled={isProcessing}
        >
          {isProcessing ? 'Saving...' : 'Save Notes'}
        </Button>
        <Button
          type="button"
          variant={action === 'approve' ? 'default' : 'destructive'}
          onClick={onSubmit}
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
    );
  }

  return (
    <Button type="button" onClick={onSaveNotes} disabled={isProcessing}>
      {isProcessing ? 'Saving...' : 'Save Notes'}
    </Button>
  );
};

export default DialogFooterActions;
