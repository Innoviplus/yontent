
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface MissionSubmissionErrorProps {
  error?: string;
}

const MissionSubmissionError = ({ error }: MissionSubmissionErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium">Mission Not Found</h3>
            <p className="text-gray-500 mt-2">
              {error || "The mission you're looking for doesn't exist or isn't available."}
            </p>
            <Button onClick={() => navigate('/missions')} className="mt-6">
              Go Back to Missions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSubmissionError;
