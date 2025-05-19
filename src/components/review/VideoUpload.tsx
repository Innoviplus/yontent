import { useState, useRef, useEffect } from 'react';
import { Upload, X, Video, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  console.log('VideoUpload rendered with videoPreviewUrls:', videoPreviewUrls);

  // Generate thumbnail when an existing video is provided
  useEffect(() => {
    if (!videoPreviewUrls || videoPreviewUrls.length === 0 || !videoPreviewUrls[0]) {
      setThumbnailUrl(null);
      setVideoLoaded(false);
      return;
    }

    const videoUrl = videoPreviewUrls[0];
    console.log('Attempting to create thumbnail for video:', videoUrl);
      
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.muted = true;
      video.preload = 'metadata';
        
      video.onloadedmetadata = () => {
        console.log('Video metadata loaded, seeking to frame');
        // Set to a slight offset for better thumbnails
        video.currentTime = 0.5;
      };
        
      video.onseeked = () => {
        try {
          console.log('Creating thumbnail from video frame');
          // Create a canvas and draw the video frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
            
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg');
            console.log('Thumbnail created successfully');
            setThumbnailUrl(thumbnail);
            setVideoLoaded(true);
          }
        } catch (err) {
          console.error('Error generating video thumbnail:', err);
        }
      };
        
      video.onerror = (e) => {
        console.error('Error loading video for thumbnail generation:', e);
        setVideoLoaded(false);
      };
        
      console.log('Video element created and source set');
    } catch (error) {
      console.error('Exception in thumbnail creation:', error);
    }
  }, [videoPreviewUrls]);

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
      
      video.onloadedmetadata = () => {
        setValidationProgress(50);
        
        if (video.duration > maxDuration) {
          setValidationError(`Video must be ${maxDuration} seconds or less. Selected video is ${Math.round(video.duration)} seconds.`);
          setValidating(false);
          URL.revokeObjectURL(video.src);
          return;
        }
        
        video.currentTime = 0.1;
        
        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnailDataUrl = canvas.toDataURL('image/jpeg');
              setThumbnailUrl(thumbnailDataUrl);
            }
            
            setValidationProgress(100);
            setValidationError(null);
            setValidating(false);
            
            console.log('Video validated successfully, sending to parent component');
            onFileSelect(e.target.files);
            
            // Cleanup
            URL.revokeObjectURL(video.src);
          } catch (err) {
            console.error('Error generating thumbnail:', err);
            setValidationError('Could not generate video preview');
            setValidating(false);
            URL.revokeObjectURL(video.src);
          }
        };
        
        video.onerror = () => {
          setValidationError('Could not validate video. Please try another file.');
          setValidating(false);
          URL.revokeObjectURL(video.src);
        };
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
      {!hasVideo && (
        <div className="border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-gray-400">
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
            <Video className="h-8 w-8 text-brand-slate/60" />
            <p className="text-sm font-medium">Upload a video of your experience</p>
            <p className="text-xs">Maximum 1 video • Max 60 seconds • MP4, MOV, WEBM formats</p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
            disabled={uploading || validating}
          />
          
          <Button
            type="button"
            onClick={triggerFileInput}
            className="mt-4"
            variant="outline"
            disabled={uploading || validating}
          >
            Select Video
          </Button>
        </div>
      )}
      
      {validating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Validating video...</span>
            <span className="text-sm text-gray-500">{validationProgress}%</span>
          </div>
          <Progress value={validationProgress} className="h-2" />
        </div>
      )}
      
      {(error || validationError) && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || validationError}
          </AlertDescription>
        </Alert>
      )}
      
      {hasVideo && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Uploaded Video:</h3>
          <div className="relative">
            <video 
              src={videoPreviewUrls[0]} 
              controls 
              poster={thumbnailUrl || undefined}
              preload="metadata"
              className="w-full h-auto rounded-lg border border-gray-200"
              onError={(e) => {
                console.error('Video element error:', e);
                setVideoLoaded(false);
              }}
              onLoadedData={() => setVideoLoaded(true)}
            />
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Video className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Video loading...</p>
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                type="button"
                onClick={() => onRemoveVideo(0)}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 rounded-full p-1 transition-colors shadow-sm"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Max 60s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
