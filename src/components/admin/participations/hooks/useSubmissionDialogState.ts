
import { useState } from "react";
import { Participation, SubmissionData, ReviewSubmissionData, ReceiptSubmissionData } from "@/hooks/admin/participations/types";

// Type guard functions to safely check submission data types
const isReviewSubmission = (data: any): data is ReviewSubmissionData => {
  return data && (data.submission_type === 'REVIEW' || 'review_id' in data);
};

const isReceiptSubmission = (data: any): data is ReceiptSubmissionData => {
  return data && (data.submission_type === 'RECEIPT' || 'receipt_images' in data);
};

export const useSubmissionDialogState = (participation?: Participation) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  if (!participation) {
    return {
      submissionData: {},
      isReview: false,
      isReceipt: false,
      images: [],
      selectedImageIndex,
      openImageModal: () => {},
      closeImageModal: () => {},
      navigateImage: () => {},
      openImageInNewTab: () => {},
      openReviewInNewTab: () => {}
    };
  }
  
  const submissionData = participation.submission_data as unknown as SubmissionData || {};
  const isReview = isReviewSubmission(submissionData);
  const isReceipt = isReceiptSubmission(submissionData);
  
  // Get all images for the carousel
  const getAllImages = () => {
    if (isReview && submissionData.review_images) {
      return submissionData.review_images;
    }
    if (isReceipt && submissionData.receipt_images) {
      return submissionData.receipt_images;
    }
    return [];
  };

  const images = getAllImages();

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0);
    }
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const openReviewInNewTab = (reviewId: string) => {
    window.open(`/review/${reviewId}`, '_blank', 'noopener,noreferrer');
  };

  return {
    submissionData,
    isReview,
    isReceipt,
    images,
    selectedImageIndex,
    openImageModal,
    closeImageModal,
    navigateImage,
    openImageInNewTab,
    openReviewInNewTab
  };
};
