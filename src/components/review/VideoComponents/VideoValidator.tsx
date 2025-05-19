
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface VideoValidatorProps {
  validating: boolean;
  progress: number;
}

const VideoValidator = ({ validating, progress }: VideoValidatorProps) => {
  if (!validating) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Validating video...</span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default VideoValidator;
