
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ReviewSubmissionData } from "@/hooks/admin/participations/types";

interface ReviewSubmissionContentProps {
  submissionData: ReviewSubmissionData;
  openReviewInNewTab: (reviewId: string) => void;
  openImageInNewTab: (imageUrl: string) => void;
}

const ReviewSubmissionContent = ({ 
  submissionData, 
  openReviewInNewTab, 
  openImageInNewTab 
}: ReviewSubmissionContentProps) => {
  return (
    <div className="space-y-6">
      {/* Review Link Section */}
      {submissionData.review_id && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Review Post:</h3>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-700">Review ID:</span>
              <span className="text-sm text-blue-900 font-mono">{submissionData.review_id}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openReviewInNewTab(submissionData.review_id!)}
              className="flex items-center space-x-1 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Review</span>
            </Button>
          </div>
        </div>
      )}
      
      {submissionData.review_images && 
       Array.isArray(submissionData.review_images) && 
       submissionData.review_images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Review Images ({submissionData.review_images.length}):</h3>
          <div className="space-y-2">
            {submissionData.review_images.map((image: string, index: number) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600">Image {index + 1}:</span>
                  <span className="text-sm text-gray-800 font-mono truncate max-w-md">{image}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openImageInNewTab(image)}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Video Section */}
      {submissionData.review_video && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Review Video:</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">Video:</span>
              <span className="text-sm text-gray-800 font-mono truncate max-w-md">{submissionData.review_video}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openImageInNewTab(submissionData.review_video!)}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissionContent;
