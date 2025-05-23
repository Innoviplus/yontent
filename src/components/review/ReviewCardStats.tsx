
import { Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/formatUtils';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewCardStatsProps {
  viewsCount: number;
  likesCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
  reviewId?: string;
}

const ReviewCardStats = ({ 
  viewsCount, 
  likesCount: initialLikesCount, 
  isLiked, 
  isLoading, 
  onLikeClick,
  reviewId 
}: ReviewCardStatsProps) => {
  const [displayedLikesCount, setDisplayedLikesCount] = useState(initialLikesCount);
  
  // Fetch accurate like count when component mounts
  useEffect(() => {
    const fetchAccurateLikesCount = async () => {
      if (!reviewId) {
        setDisplayedLikesCount(initialLikesCount);
        return;
      }
      
      try {
        // Get count directly from review_likes table
        const { count, error } = await supabase
          .from('review_likes')
          .select('*', { count: 'exact', head: false })
          .eq('review_id', reviewId);
          
        if (!error && count !== null) {
          console.log(`ReviewCardStats: Accurate like count for ${reviewId}: ${count} (was ${initialLikesCount})`);
          setDisplayedLikesCount(count);
        } else {
          setDisplayedLikesCount(initialLikesCount);
        }
      } catch (err) {
        console.error('Error fetching accurate like count:', err);
        setDisplayedLikesCount(initialLikesCount);
      }
    };
    
    fetchAccurateLikesCount();
  }, [reviewId, initialLikesCount]);

  return (
    <div className="flex items-center gap-3 justify-between">
      <div className="flex items-center text-xs text-gray-500">
        <Eye className="h-3 w-3 mr-0.5" />
        <span>{formatNumber(viewsCount || 0)}</span>
      </div>
      
      {/* Like count with heart icon */}
      <div className="flex items-center text-xs">
        <button 
          className={cn(
            "flex items-center transition-colors",
            isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          )} 
          onClick={onLikeClick}
          disabled={isLoading}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart className={cn(
            "h-3 w-3 mr-0.5",
            isLiked ? "fill-red-500 text-red-500" : ""
          )} />
          <span>
            {formatNumber(displayedLikesCount || 0)}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCardStats;
