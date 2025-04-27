
import React from 'react';
import { Button } from '@/components/ui/button';

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
      <p className="text-red-700 text-sm">{error}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={onRefresh}
      >
        Retry
      </Button>
    </div>
  );
};

export default ParticipationError;
