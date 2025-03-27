
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import ReceiptImageGallery from './ReceiptImageGallery';

interface ReviewSubmissionContentProps {
  reviewId?: string;
  reviewImages?: string[];
  openReviewLink: (reviewId: string) => void;
}

const ReviewSubmissionContent: React.FC<ReviewSubmissionContentProps> = ({
  reviewId,
  reviewImages,
  openReviewLink
}) => {
  if (!reviewId) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      <Button 
        variant="outline" 
        className="flex items-center w-fit"
        onClick={() => openReviewLink(reviewId)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Open Review in New Tab
      </Button>

      {reviewImages && reviewImages.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-2">Review Images:</h5>
          <ReceiptImageGallery images={reviewImages} />
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionContent;
