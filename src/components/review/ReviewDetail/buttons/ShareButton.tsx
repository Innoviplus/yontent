
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShareAction } from '@/hooks/review/useShareAction';

interface ShareButtonProps {
  reviewId: string;
}

const ShareButton = ({ reviewId }: ShareButtonProps) => {
  const { handleCopyLink } = useShareAction();
  
  const handleShare = () => {
    handleCopyLink();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleShare}>
      <Share2 className="h-5 w-5" />
    </Button>
  );
};

export default ShareButton;
