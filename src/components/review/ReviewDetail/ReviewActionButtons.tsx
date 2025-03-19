
import { Heart, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReviewActionButtonsProps {
  likesCount: number;
  hasLiked: boolean;
  onLike: () => void;
  likeLoading: boolean;
}

const ReviewActionButtons = ({ 
  likesCount, 
  hasLiked, 
  onLike,
  likeLoading
}: ReviewActionButtonsProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="flex space-x-2">
      <Button 
        onClick={onLike} 
        variant="outline" 
        size="sm" 
        className="flex items-center space-x-1"
        disabled={likeLoading}
      >
        <Heart className={`h-4 w-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span>{likesCount || 0}</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Bookmark className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ReviewActionButtons;
