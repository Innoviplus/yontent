
import React from 'react';
import { InboxIcon, RefreshCcw } from 'lucide-react';

const EmptyParticipations: React.FC = () => {
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
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <RefreshCcw className="h-3 w-3 mr-1" />
          <span>Try refreshing or checking back later</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyParticipations;
