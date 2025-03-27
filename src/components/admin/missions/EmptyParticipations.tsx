
import React from 'react';

const EmptyParticipations: React.FC = () => {
  return (
    <div className="text-center p-6 border rounded-md bg-muted/50">
      <p className="text-muted-foreground">No mission submissions found</p>
    </div>
  );
};

export default EmptyParticipations;
