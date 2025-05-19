
import React, { useRef } from 'react';
import VideoPreview from './VideoComponents/VideoPreview';
import VideoValidator from './VideoComponents/VideoValidator';
import VideoUploadArea from './VideoComponents/VideoUploadArea';
import ErrorAlert from './VideoComponents/ErrorAlert';
import { useState } from 'react';

interface VideoUploadProps {
  videoPreviewUrls: string[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveVideo: () => void;
  error: string | null;
  uploading: boolean;
  maxDuration?: number;
}

const VideoUpload = ({ 
  videoPreviewUrls, 
  onFileSelect, 
  onRemoveVideo, 
  error, 
  uploading,
  maxDuration = 60 
}: VideoUploadProps) => {
  const [validating, setValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      // Show validation UI
      setValidating(true);
      setProgress(0);
      
      // Simulate validation progress for better UX
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setValidating(false);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      // Pass the files to parent component
      onFileSelect(files);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="mb-2">
        <h3 className="font-medium text-gray-900">Video</h3>
      </div>
      
      {/* Video Preview or Upload Area */}
      {videoPreviewUrls.length > 0 ? (
        <VideoPreview 
          videoUrl={videoPreviewUrls[0]} 
          onRemove={onRemoveVideo} 
          maxDuration={maxDuration}
          uploading={uploading}
        />
      ) : (
        <>
          <VideoUploadArea 
            onFileSelect={handleFileSelect} 
            fileInputRef={fileInputRef} 
            disabled={uploading || validating} 
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/mov,video/webm"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={uploading || validating}
          />
        </>
      )}
      
      {/* Validation Progress */}
      <VideoValidator validating={validating} progress={progress} />
      
      {/* Error Message */}
      <ErrorAlert error={error} />
    </div>
  );
};

export default VideoUpload;
