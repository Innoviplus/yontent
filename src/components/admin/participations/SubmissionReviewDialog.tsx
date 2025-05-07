
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Participation, SubmissionData, ReviewSubmissionData, ReceiptSubmissionData } from "@/hooks/admin/participations/useParticipations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  if (!participation) return null;
  
  const submissionData = participation.submission_data as unknown as SubmissionData || {};
  const isReview = isReviewSubmission(submissionData);
  const isReceipt = isReceiptSubmission(submissionData);
  
  // Handle different submission types
  const renderSubmissionContent = () => {
    if (isReview) {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Review Content:</h3>
            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
              {submissionData.content || "No content provided"}
            </p>
          </div>
          
          {submissionData.review_images && 
           Array.isArray(submissionData.review_images) && 
           submissionData.review_images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Review Images:</h3>
              <div className="grid grid-cols-2 gap-2">
                {submissionData.review_images.map((image: string, index: number) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                    <img src={image} alt={`Review image ${index + 1}`} className="object-cover w-full h-full" />
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
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Receipt Images:</h3>
            <div className="grid grid-cols-1 gap-4">
              {submissionData.receipt_images &&
               Array.isArray(submissionData.receipt_images) &&
               submissionData.receipt_images.map((image: string, index: number) => (
                <div key={index} className="relative rounded-md overflow-hidden">
                  <img src={image} alt={`Receipt image ${index + 1}`} className="object-contain w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="py-4 text-center text-gray-500">
        No submission data available
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
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
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Mission</p>
              <p className="font-medium">{participation.mission?.title || 'Unknown mission'}</p>
            </div>
            <div>
              <p className="text-gray-500">Submitted by</p>
              <p className="font-medium">{participation.profile?.username || 'Unknown user'}</p>
            </div>
            <div>
              <p className="text-gray-500">Submitted on</p>
              <p className="font-medium">{new Date(participation.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">{isReview ? 'Review' : isReceipt ? 'Receipt' : 'Unknown'}</p>
            </div>
          </div>
          
          <Separator />
          
          <ScrollArea className="max-h-[60vh]">
            {renderSubmissionContent()}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionReviewDialog;
