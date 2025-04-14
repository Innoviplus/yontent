
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Eye, Heart, Play } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { trackReviewView } from '@/services/review/trackViews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasVideo = review.videos && review.videos.length > 0;
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  
  // Generate video thumbnail if needed
  useEffect(() => {
    if (hasVideo && review.videos[0]) {
      const videoEl = document.createElement('video');
      videoEl.crossOrigin = 'anonymous';
      videoEl.src = review.videos[0];
      videoEl.preload = 'metadata';
      
      videoEl.onloadedmetadata = () => {
        videoEl.currentTime = 0.5;
        
        videoEl.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              setVideoThumbnail(canvas.toDataURL('image/jpeg', 0.7));
            }
          } catch (err) {
            console.error('Error generating video thumbnail:', err);
          }
        };
      };
    }
  }, [hasVideo, review.videos]);

  const handleCardClick = () => {
    trackReviewView(review.id);
    navigate(`/review/${review.id}`);
  };
  
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (review.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-sm h-full card-hover",
        "hover:shadow-md transform hover:-translate-y-1 transition-all duration-200",
        className
      )}
    >
      {/* Review images - Show only first image or video thumbnail */}
      {(review.images.length > 0 || hasVideo) && (
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          {hasVideo ? (
            <>
              <img 
                src={videoThumbnail || review.images[0] || review.videos[0]} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                  <Play className="h-5 w-5 text-white" fill="white" />
                </div>
              </div>
            </>
          ) : (
            <img 
              src={review.images[0]} 
              alt="Review image" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          
          {/* Image count badge - only show if there are multiple images or videos */}
          {(review.images.length > 1 || (review.videos && review.videos.length > 0)) && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>{review.images.length + (review.videos?.length || 0)}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-2">
        {/* User info at the top */}
        <div onClick={handleUserClick} className="flex items-center mb-1.5 cursor-pointer">
          <Avatar className="h-5 w-5 mr-1.5">
            <AvatarImage src={review.user?.avatar || ''} alt={review.user?.username || 'User'} />
            <AvatarFallback>
              <User className="h-2.5 w-2.5" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500 truncate max-w-[100px]">
            {review.user?.username || 'Anonymous'}
          </span>
        </div>
        
        {/* Content - max 2 lines with truncation, with HTML tags stripped */}
        <div className="text-gray-600 text-xs mb-1.5">
          <p className="line-clamp-2 min-h-[2em]">
            {stripHtml(review.content)}
          </p>
        </div>
        
        {/* Stats: Views and Likes */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="h-3 w-3 mr-0.5" />
            <span>{review.viewsCount || 0}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Heart className="h-3 w-3 mr-0.5 text-red-500" />
            <span>{review.likesCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
