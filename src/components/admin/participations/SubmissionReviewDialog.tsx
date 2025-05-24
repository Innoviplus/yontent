
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Participation, SubmissionData, ReviewSubmissionData, ReceiptSubmissionData } from "@/hooks/admin/participations/useParticipations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmissionReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participation?: Participation;
}

// Type guard functions to safely check submission data types
const isReviewSubmission = (data: any): data is ReviewSubmissionData => {
  return data && (data.submission_type === 'REVIEW' || 'review_id' in data);
};

const isReceiptSubmission = (data: any): data is ReceiptSubmissionData => {
  return data && (data.submission_type === 'RECEIPT' || 'receipt_images' in data);
};

const SubmissionReviewDialog = ({ isOpen, onClose, participation }: SubmissionReviewDialogProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  if (!participation) return null;
  
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

  // Handle different submission types
  const renderSubmissionContent = () => {
    if (isReview) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Review Content:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {submissionData.content || "No content provided"}
              </p>
            </div>
          </div>
          
          {submissionData.review_images && 
           Array.isArray(submissionData.review_images) && 
           submissionData.review_images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Review Images ({submissionData.review_images.length}):</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {submissionData.review_images.map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
                    onClick={() => openImageModal(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Review image ${index + 1}`} 
                      className="object-cover w-full h-full hover:scale-105 transition-transform" 
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs py-1 px-2 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (isReceipt) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Receipt Images ({submissionData.receipt_images?.length || 0}):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submissionData.receipt_images &&
               Array.isArray(submissionData.receipt_images) &&
               submissionData.receipt_images.map((image: string, index: number) => (
                <div 
                  key={index} 
                  className="relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
                  onClick={() => openImageModal(index)}
                >
                  <img 
                    src={image} 
                    alt={`Receipt image ${index + 1}`} 
                    className="object-contain w-full max-h-96 hover:scale-105 transition-transform" 
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs py-1 px-2 rounded">
                    Receipt {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="text-lg">No submission data available</p>
      </div>
    );
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600 font-medium">Mission</p>
                <p className="font-semibold text-gray-900">{participation.mission?.title || 'Unknown mission'}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Submitted by</p>
                <p className="font-semibold text-gray-900">{participation.profile?.username || 'Unknown user'}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Submitted on</p>
                <p className="font-semibold text-gray-900">{new Date(participation.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Type</p>
                <p className="font-semibold text-gray-900">{isReview ? 'Review' : isReceipt ? 'Receipt' : 'Unknown'}</p>
              </div>
            </div>
            
            <Separator />
            
            <ScrollArea className="max-h-[50vh]">
              {renderSubmissionContent()}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-screen image modal */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <Dialog open={true} onOpenChange={closeImageModal}>
          <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 bg-black/95">
            <div className="relative w-full h-full flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={closeImageModal}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={() => navigateImage('prev')}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                    onClick={() => navigateImage('next')}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
              
              <img
                src={images[selectedImageIndex]}
                alt={`${isReview ? 'Review' : 'Receipt'} image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg">
                {selectedImageIndex + 1} of {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SubmissionReviewDialog;
