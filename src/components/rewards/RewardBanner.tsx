
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface RewardBannerProps {
  bannerImage?: string;
  name: string;
}

const RewardBanner: React.FC<RewardBannerProps> = ({ bannerImage, name }) => {
  if (!bannerImage) return null;
  
  return (
    <div className="rounded-lg overflow-hidden h-full flex items-center">
      <AspectRatio ratio={16 / 9} className="w-full">
        <img 
          src={bannerImage} 
          alt={`${name} Banner`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).style.display = 'none';
          }} 
        />
      </AspectRatio>
    </div>
  );
};

export default RewardBanner;
