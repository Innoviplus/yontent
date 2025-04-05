
import React from 'react';

interface RewardBannerProps {
  bannerImage?: string;
  name: string;
}

const RewardBanner: React.FC<RewardBannerProps> = ({ bannerImage, name }) => {
  if (!bannerImage) return null;
  
  return (
    <div className="rounded-lg overflow-hidden h-full">
      <div 
        className="w-full bg-cover bg-center rounded-lg"
        style={{ 
          backgroundImage: `url(${bannerImage})`,
          height: '306px'
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
    </div>
  );
};

export default RewardBanner;
