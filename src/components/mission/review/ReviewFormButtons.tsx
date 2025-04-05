
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';

interface ReviewFormButtonsProps {
  isSubmitting: boolean;
  missionId: string;
}

const ReviewFormButtons = ({ isSubmitting, missionId }: ReviewFormButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end space-x-4">
      <Button 
        variant="outline" 
        onClick={() => navigate(`/mission/${missionId}`)}
        disabled={isSubmitting}
        type="button"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-brand-teal hover:bg-brand-teal/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Submit Review
          </>
        )}
      </Button>
    </div>
  );
};

export default ReviewFormButtons;
