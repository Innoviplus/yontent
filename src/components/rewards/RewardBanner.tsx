
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface RewardBannerProps {
  bannerImage?: string;
  name: string;
}

const RewardBanner: React.FC<RewardBannerProps> = ({ bannerImage, name }) => {
  const isMobile = useIsMobile();
  
  if (!bannerImage) return null;
  
  return (
    <div className="rounded-lg overflow-hidden mt-4">
      <AspectRatio ratio={16/9} className="w-full">
        <div 
          className="w-full h-full bg-cover bg-center rounded-lg"
          style={{ 
            backgroundImage: `url(${bannerImage})`
          }}
        >
          <img 
            src={bannerImage} 
            alt={`${name} Banner`} 
            className="w-full h-full object-cover hidden"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).style.display = 'none';
            }} 
          />
        </div>
      </AspectRatio>
    </div>
  );
};

export default RewardBanner;
