
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ParticipationErrorProps {
  error: string;
  onRefresh: () => void;
}

const ParticipationError: React.FC<ParticipationErrorProps> = ({
  error,
  onRefresh
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div className="flex items-start">
        <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-2" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 mb-1">Error loading participations</h4>
          <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 bg-white hover:bg-red-50"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParticipationError;
