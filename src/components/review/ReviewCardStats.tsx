
import { Eye, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardStatsProps {
  viewsCount: number;
  likesCount: number;
  isLiked: boolean;
  isLoading: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
}

const ReviewCardStats = ({ viewsCount, likesCount, isLiked, isLoading, onLikeClick }: ReviewCardStatsProps) => {
  return (
    <div className="flex items-center gap-3 justify-between">
      <div className="flex items-center text-xs text-gray-500">
        <Eye className="h-3 w-3 mr-0.5" />
        <span>{viewsCount || 0}</span>
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
        >
          <Heart className={cn(
            "h-3 w-3 mr-0.5",
            isLiked ? "fill-red-500 text-red-500" : ""
          )} />
          <span>
            {likesCount || 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCardStats;
