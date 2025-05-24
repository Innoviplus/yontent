
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SocialProofSubmissionData } from "@/hooks/admin/participations/types";

interface SocialProofSubmissionContentProps {
  submissionData: SocialProofSubmissionData;
  openImageInNewTab: (imageUrl: string) => void;
}

const SocialProofSubmissionContent = ({ 
  submissionData, 
  openImageInNewTab 
}: SocialProofSubmissionContentProps) => {
  return (
    <div className="space-y-6">
      {/* Proof URL Section */}
      {submissionData.proofUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Proof URL:</h3>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-700">URL:</span>
              <span className="text-sm text-blue-900 break-all">{submissionData.proofUrl}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(submissionData.proofUrl, '_blank', 'noopener,noreferrer')}
              className="flex items-center space-x-1 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open</span>
            </Button>
          </div>
        </div>
      )}

      {/* Additional Remarks Section */}
      {submissionData.additionalRemarks && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Additional Remarks:</h3>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{submissionData.additionalRemarks}</p>
          </div>
        </div>
      )}
      
      {/* Proof Images Section */}
      {submissionData.proofImages && 
       Array.isArray(submissionData.proofImages) && 
       submissionData.proofImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Proof Images ({submissionData.proofImages.length}):</h3>
          <div className="space-y-2">
            {submissionData.proofImages.map((image: string, index: number) => (
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

      {/* Submission Date */}
      {submissionData.submittedAt && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Submitted At:</h3>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-800">
              {new Date(submissionData.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialProofSubmissionContent;
