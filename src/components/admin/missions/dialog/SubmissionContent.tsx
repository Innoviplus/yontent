
import React from 'react';
import ReceiptImageGallery from './ReceiptImageGallery';
import ReviewSubmissionContent from './ReviewSubmissionContent';

interface SubmissionContentProps {
  missionType: string;
  submissionData: {
    receipt_images?: string[];
    review_id?: string;
    review_images?: string[];
    review_url?: string;
    submission_type?: 'RECEIPT' | 'REVIEW'; // Made optional to match the type
  } | null;
  openReviewLink: (reviewId: string) => void;
}

const SubmissionContent: React.FC<SubmissionContentProps> = ({
  missionType,
  submissionData,
  openReviewLink
}) => {
  if (!submissionData) {
    return <p className="text-muted-foreground">No submission content available</p>;
  }

  if (missionType === 'RECEIPT' && submissionData.receipt_images?.length) {
    return <ReceiptImageGallery images={submissionData.receipt_images} />;
  } 
  
  if (missionType === 'REVIEW' && submissionData.review_id) {
    return (
      <ReviewSubmissionContent 
        reviewId={submissionData.review_id}
        reviewImages={submissionData.review_images}
        openReviewLink={openReviewLink}
      />
    );
  }

  return <p className="text-muted-foreground">No submission content available</p>;
};

export default SubmissionContent;
