
import { useState, useEffect } from 'react';
import { Video } from 'lucide-react';

interface VideoThumbnailProps {
  videoUrl: string | null;
  onThumbnailGenerated?: (thumbnailUrl: string) => void;
}

const VideoThumbnail = ({ videoUrl, onThumbnailGenerated }: VideoThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoUrl) {
      setThumbnailUrl(null);
      return;
    }

    setIsLoading(true);
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
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 180;
          const ctx = canvas.getContext('2d');
            
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg');
            console.log('Thumbnail created successfully');
            setThumbnailUrl(thumbnail);
            if (onThumbnailGenerated) {
              onThumbnailGenerated(thumbnail);
            }
          }
          setIsLoading(false);
        } catch (err) {
          console.error('Error generating video thumbnail:', err);
          setError('Failed to generate thumbnail');
          setIsLoading(false);
        }
      };
        
      video.onerror = (e) => {
        console.error('Error loading video for thumbnail generation:', e);
        setError('Error loading video');
        setIsLoading(false);
      };
      
      document.body.appendChild(video);
      video.style.display = 'none';
        
      return () => {
        if (document.body.contains(video)) {
          document.body.removeChild(video);
        }
      };
    } catch (error) {
      console.error('Exception in thumbnail creation:', error);
      setError('Error creating thumbnail');
      setIsLoading(false);
    }
  }, [videoUrl, onThumbnailGenerated]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 w-full h-full rounded-lg">
        <div className="text-center">
          <Video className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Generating thumbnail...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-100 w-full h-full rounded-lg">
        <div className="text-center">
          <Video className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return thumbnailUrl ? (
    <img 
      src={thumbnailUrl} 
      alt="Video thumbnail"
      className="w-full h-full object-cover rounded-lg"
    />
  ) : (
    <div className="flex items-center justify-center bg-gray-100 w-full h-full rounded-lg">
      <div className="text-center">
        <Video className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No thumbnail available</p>
      </div>
    </div>
  );
};

export default VideoThumbnail;
