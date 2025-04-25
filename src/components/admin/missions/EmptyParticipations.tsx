
import React from 'react';
import { InboxIcon, RefreshCcw, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyParticipationsProps {
  onRefreshClick?: () => Promise<void>;
  error?: string;
}

const EmptyParticipations: React.FC<EmptyParticipationsProps> = ({ onRefreshClick, error }) => {
  return (
    <div className="text-center p-8 border rounded-md bg-muted/30">
      <div className="flex flex-col items-center gap-3">
        <div className="bg-muted/50 p-3 rounded-full">
          <InboxIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium">No mission submissions found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          There are no mission participations to display at the moment. When users submit missions, they will appear here for review.
        </p>
        
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-left w-full max-w-md">
            <div className="flex items-start">
              <AlertCircleIcon className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">Error fetching participations:</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <RefreshCcw className="h-3 w-3 mr-1" />
          <span>Try refreshing or checking back later</span>
        </div>
        
        {onRefreshClick && (
          <Button 
            onClick={onRefreshClick}
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Refreshing Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyParticipations;
