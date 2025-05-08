
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LikeButtonProps {
  likesCount: number;
  hasLiked: boolean;
  onClick: () => void;
  isLoading: boolean;
}

const LikeButton = ({ likesCount, hasLiked, onClick, isLoading }: LikeButtonProps) => {
  // Ensure likes count is never negative
  const displayCount = Math.max(0, likesCount);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className="text-gray-600 relative"
      aria-label={hasLiked ? "Unlike" : "Like"}
    >
      <Heart 
        className={`h-5 w-5 mr-1 transition-colors ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} 
      />
      <span className="text-gray-600">{displayCount}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-white/50 rounded">
          <div className="h-3 w-3 border-t-2 border-b-2 border-brand-teal rounded-full animate-spin"></div>
        </span>
      )}
    </Button>
  );
};

export default LikeButton;
