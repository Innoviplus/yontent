
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubmissionContent from '@/components/admin/missions/dialog/SubmissionContent';

interface SubmissionReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participation?: {
    mission: {
      title: string;
      type: string;
    };
    submission_data: {
      receipt_images?: string[];
      review_content?: string;
      review_id?: string;
    };
  };
}

const SubmissionReviewDialog = ({ isOpen, onClose, participation }: SubmissionReviewDialogProps) => {
  const openReviewLink = (reviewId: string) => {
    window.open(`/review/${reviewId}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{participation?.mission?.title || 'Review Submission'}</DialogTitle>
        </DialogHeader>
        
        {participation && (
          <div className="mt-4">
            <SubmissionContent
              missionType={participation.mission.type}
              submissionData={participation.submission_data}
              openReviewLink={openReviewLink}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionReviewDialog;
