
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const LikeButton = ({
  isLiked,
  likesCount,
  onClick,
  isLoading = false,
  disabled = false
}: LikeButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 hover:bg-gray-100"
            onClick={onClick}
            disabled={disabled || isLoading}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "fill-none"
              )} 
            />
            <span className={cn("text-sm", isLiked && "text-red-500")}>
              {likesCount > 0 ? likesCount : ''}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLiked ? 'Unlike' : 'Like'} this review</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LikeButton;
