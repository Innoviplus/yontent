
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ReceiptSubmissionData } from "@/hooks/admin/participations/types";

interface ReceiptSubmissionContentProps {
  submissionData: ReceiptSubmissionData;
  openImageInNewTab: (imageUrl: string) => void;
}

const ReceiptSubmissionContent = ({ submissionData, openImageInNewTab }: ReceiptSubmissionContentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Receipt Images ({submissionData.receipt_images?.length || 0}):</h3>
        <div className="space-y-2">
          {submissionData.receipt_images &&
           Array.isArray(submissionData.receipt_images) &&
           submissionData.receipt_images.map((image: string, index: number) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600">Receipt {index + 1}:</span>
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
    </div>
  );
};

export default ReceiptSubmissionContent;
