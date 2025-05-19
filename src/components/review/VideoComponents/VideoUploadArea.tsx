
import { useRef } from 'react';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoUploadAreaProps {
  onFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
}

const VideoUploadArea = ({ onFileSelect, fileInputRef, disabled = false }: VideoUploadAreaProps) => {
  return (
    <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-gray-400">
      <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
        <Video className="h-8 w-8 text-brand-slate/60" />
        <p className="text-sm font-medium">Upload a video of your experience</p>
        <p className="text-xs">Maximum 1 video • Max 60 seconds • MP4, MOV, WEBM formats</p>
      </div>
      
      <Button
        type="button"
        onClick={onFileSelect}
        className="mt-4"
        variant="outline"
        disabled={disabled}
      >
        Select Video
      </Button>
    </div>
  );
};

export default VideoUploadArea;
