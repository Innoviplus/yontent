
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import VideoUploadArea from './VideoComponents/VideoUploadArea';
import VideoValidator from './VideoComponents/VideoValidator';
import ErrorAlert from './VideoComponents/ErrorAlert';
import VideoPreview from './VideoComponents/VideoPreview';

interface VideoUploadProps {
  videoPreviewUrls: string[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveVideo: (index: number) => void;
  error: string | null;
  uploading: boolean;
  maxDuration?: number; // in seconds
}

const VideoUpload = ({
  videoPreviewUrls,
  onFileSelect,
  onRemoveVideo,
  error,
  uploading,
  maxDuration = 60
}: VideoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validating, setValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  console.log('VideoUpload rendered with videoPreviewUrls:', videoPreviewUrls);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    console.log('Video file selected:', file.name, file.size, file.type);
    
    if (!file.type.startsWith('video/')) {
      setValidationError('Please select a video file');
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      setValidationError('Video file size must be less than 100MB');
      return;
    }
    
    setValidating(true);
    setValidationProgress(10);
    
    try {
      // Create a video element to check metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Set up event handlers first
      video.onloadedmetadata = () => {
        setValidationProgress(50);
        
        if (video.duration > maxDuration) {
          setValidationError(`Video must be ${maxDuration} seconds or less. Selected video is ${Math.round(video.duration)} seconds.`);
          setValidating(false);
          URL.revokeObjectURL(video.src);
          return;
        }
        
        video.currentTime = 0.1;
      };
      
      video.onseeked = () => {
        try {
          setValidationProgress(100);
          setValidationError(null);
          setValidating(false);
          
          console.log('Video validated successfully, sending to parent component');
          onFileSelect(e.target.files);
          
          // Cleanup
          URL.revokeObjectURL(video.src);
        } catch (err) {
          console.error('Error during video validation:', err);
          setValidationError('Could not validate video');
          setValidating(false);
          URL.revokeObjectURL(video.src);
        }
      };
      
      video.onerror = () => {
        setValidationError('Could not validate video. Please try another file.');
        setValidating(false);
        URL.revokeObjectURL(video.src);
      };
      
      // Set source after adding event listeners
      video.src = URL.createObjectURL(file);
      setValidationProgress(30);
    } catch (error) {
      console.error('Video validation error:', error);
      setValidationError('Error validating video');
      setValidating(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const hasVideo = videoPreviewUrls && videoPreviewUrls.length > 0 && videoPreviewUrls[0];

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
        disabled={uploading || validating}
      />
      
      {/* Either show upload area or video preview */}
      {!hasVideo ? (
        <VideoUploadArea 
          onFileSelect={triggerFileInput} 
          fileInputRef={fileInputRef}
          disabled={uploading || validating} 
        />
      ) : (
        <VideoPreview
          videoUrl={videoPreviewUrls[0]}
          onRemove={() => onRemoveVideo(0)}
          maxDuration={maxDuration}
          uploading={uploading}
        />
      )}
      
      {/* Validation progress indicator */}
      <VideoValidator 
        validating={validating} 
        progress={validationProgress} 
      />
      
      {/* Error messages */}
      <ErrorAlert error={error || validationError} />
    </div>
  );
};

export default VideoUpload;
