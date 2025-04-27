
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import ReceiptImageGallery from './ReceiptImageGallery';
import ReviewSubmissionContent from './ReviewSubmissionContent';

interface SubmissionContentProps {
  missionType: string;
  submissionData: any;
  openReviewLink: (reviewId: string) => void;
}

const SubmissionContent: React.FC<SubmissionContentProps> = ({
  missionType,
  submissionData,
  openReviewLink
}) => {
  if (!submissionData) {
    return <p className="text-muted-foreground italic">No submission data available</p>;
  }

  if (missionType === 'RECEIPT') {
    return (
      <div>
        <h5 className="font-medium mb-2">Receipt Submission:</h5>
        <ReceiptImageGallery 
          images={submissionData?.receipt_images || []} 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h5 className="font-medium">Review Submission:</h5>
        {submissionData?.review_id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openReviewLink(submissionData.review_id)}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Review</span>
          </Button>
        )}
      </div>
      <ReviewSubmissionContent 
        reviewId={submissionData?.review_id} 
        reviewImages={submissionData?.review_images || []}
        openReviewLink={openReviewLink}
      />
    </div>
  );
};

export default SubmissionContent;
