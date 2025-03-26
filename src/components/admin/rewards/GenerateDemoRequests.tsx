
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createDemoRedemptionRequests } from "@/services/redemption";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface GenerateDemoRequestsProps {
  onSuccess?: () => Promise<void>;
}

const GenerateDemoRequests = ({ onSuccess }: GenerateDemoRequestsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateDemo = async () => {
    try {
      setIsGenerating(true);
      const result = await createDemoRedemptionRequests();
      
      if (result) {
        toast.success(`Generated ${result.length} demo redemption requests`);
        
        // Refresh the requests list if onSuccess is provided
        if (onSuccess) {
          await onSuccess();
        }
      } else {
        toast.error("Failed to generate demo requests");
      }
    } catch (error) {
      console.error("Error generating demo requests:", error);
      toast.error("An error occurred while generating demo requests");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateDemo}
      disabled={isGenerating}
      className="ml-2"
    >
      {isGenerating ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Demo Requests'
      )}
    </Button>
  );
};

export default GenerateDemoRequests;
