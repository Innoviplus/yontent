
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RedemptionRequest } from "@/lib/types";

interface RequestActionDialogProps {
  request: RedemptionRequest;
  action: 'approve' | 'reject';
  onAction: (adminNotes?: string) => Promise<boolean>;
  onCancel: () => void;
}

const RequestActionDialog = ({
  request,
  action,
  onAction,
  onCancel,
}: RequestActionDialogProps) => {
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onAction(notes || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isApprove = action === 'approve';
  const title = isApprove ? 'Approve Request' : 'Reject Request';
  const description = isApprove
    ? `Approve this redemption request for ${request.pointsAmount} points.`
    : `Reject this redemption request and return ${request.pointsAmount} points to the user.`;

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Admin Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this decision..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant={isApprove ? 'default' : 'destructive'}
          >
            {isSubmitting
              ? 'Processing...'
              : isApprove
              ? 'Approve Request'
              : 'Reject Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestActionDialog;
