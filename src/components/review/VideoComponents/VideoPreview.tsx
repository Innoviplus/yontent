
import { useState } from 'react';
import { Video, X, Clock } from 'lucide-react';
import VideoThumbnail from './VideoThumbnail';

interface VideoPreviewProps {
  videoUrl: string;
  onRemove: () => void;
  maxDuration?: number;
  uploading?: boolean;
}

const VideoPreview = ({ videoUrl, onRemove, maxDuration = 60, uploading = false }: VideoPreviewProps) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  const handleThumbnailGenerated = (thumbnail: string) => {
    setThumbnailUrl(thumbnail);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Uploaded Video:</h3>
      <div className="relative">
        <video 
          src={videoUrl} 
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
            onClick={onRemove}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 rounded-full p-1 transition-colors shadow-sm"
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Max {maxDuration}s</span>
        </div>
        
        {/* Hidden thumbnail generator */}
        <div className="hidden">
          <VideoThumbnail 
            videoUrl={videoUrl} 
            onThumbnailGenerated={handleThumbnailGenerated} 
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
