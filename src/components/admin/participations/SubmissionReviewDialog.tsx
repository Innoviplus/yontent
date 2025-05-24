
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Participation } from "@/hooks/admin/participations/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ParticipationSummary from "./components/ParticipationSummary";
import ReviewSubmissionContent from "./components/ReviewSubmissionContent";
import ReceiptSubmissionContent from "./components/ReceiptSubmissionContent";
import SocialProofSubmissionContent from "./components/SocialProofSubmissionContent";
import ImageCarouselModal from "./components/ImageCarouselModal";
import { useSubmissionDialogState } from "./hooks/useSubmissionDialogState";

interface SubmissionReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participation?: Participation;
}

const SubmissionReviewDialog = ({ isOpen, onClose, participation }: SubmissionReviewDialogProps) => {
  const {
    submissionData,
    isReview,
    isReceipt,
    isSocialProof,
    images,
    selectedImageIndex,
    openImageModal,
    closeImageModal,
    navigateImage,
    openImageInNewTab,
    openReviewInNewTab
  } = useSubmissionDialogState(participation);

  if (!participation) return null;

  // Handle different submission types
  const renderSubmissionContent = () => {
    if (isReview) {
      return (
        <ReviewSubmissionContent
          submissionData={submissionData as any}
          openReviewInNewTab={openReviewInNewTab}
          openImageInNewTab={openImageInNewTab}
        />
      );
    }
    
    if (isReceipt) {
      return (
        <ReceiptSubmissionContent
          submissionData={submissionData as any}
          openImageInNewTab={openImageInNewTab}
        />
      );
    }
    
    if (isSocialProof) {
      return (
        <SocialProofSubmissionContent
          submissionData={submissionData as any}
          openImageInNewTab={openImageInNewTab}
        />
      );
    }
    
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="text-lg">No submission data available</p>
      </div>
    );
  };

  const getAltText = () => {
    if (isReview) return 'Review image';
    if (isReceipt) return 'Receipt image';
    if (isSocialProof) return 'Proof image';
    return 'Image';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              Submission Details
              <Badge className={
                participation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                participation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {participation.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <ParticipationSummary participation={participation} />
            
            <Separator />
            
            <ScrollArea className="max-h-[50vh]">
              {renderSubmissionContent()}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <ImageCarouselModal
        isOpen={selectedImageIndex !== null}
        onClose={closeImageModal}
        images={images}
        currentIndex={selectedImageIndex || 0}
        onNavigate={navigateImage}
        altText={getAltText()}
      />
    </>
  );
};

export default SubmissionReviewDialog;
