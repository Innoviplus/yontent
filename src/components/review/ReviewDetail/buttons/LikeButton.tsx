
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
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className="text-gray-600"
    >
      <Heart 
        className={`h-5 w-5 mr-1 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} 
      />
      <span className="text-gray-600">{likesCount}</span>
    </Button>
  );
};

export default LikeButton;
