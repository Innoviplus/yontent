import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
interface RewardBannerProps {
  bannerImage?: string;
  name: string;
}
const RewardBanner: React.FC<RewardBannerProps> = ({
  bannerImage,
  name
}) => {
  if (!bannerImage) return null;
  return <div className="mb-4 rounded-lg overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <img src={bannerImage} alt={`${name} Banner`} onError={e => {
        (e.target as HTMLImageElement).onerror = null;
        (e.target as HTMLImageElement).style.display = 'none';
      }} className="w-full h-full object-contain" />
      </AspectRatio>
    </div>;
};
export default RewardBanner;