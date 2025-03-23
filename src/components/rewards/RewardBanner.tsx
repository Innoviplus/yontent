
import React from 'react';

interface RewardBannerProps {
  bannerImage?: string;
  name: string;
}

const RewardBanner: React.FC<RewardBannerProps> = ({ bannerImage, name }) => {
  if (!bannerImage) return null;
  
  return (
    <div className="h-40 w-full mb-4 rounded-lg overflow-hidden">
      <img 
        src={bannerImage} 
        alt={`${name} Banner`} 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null; 
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};

export default RewardBanner;
