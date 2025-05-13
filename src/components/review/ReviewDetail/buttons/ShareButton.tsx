
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  onClick: () => void;
}

const ShareButton = ({ onClick }: ShareButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <Share2 className="h-5 w-5" />
    </Button>
  );
};

export default ShareButton;
