
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RedemptionItem } from '@/types/redemption';
import { formatNumber } from '@/lib/formatUtils';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface RewardCardProps {
  reward: RedemptionItem;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/rewards/${reward.id}`);
  };
  
  return (
    <div
      onClick={handleCardClick}
      className="bg-white shadow-sm rounded-lg hover:shadow-md transition cursor-pointer"
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* Logo image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {reward.image_url ? (
              <img
                src={reward.image_url}
                alt={reward.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>
          
          {/* Title and points moved to right side */}
          <div className="flex flex-col flex-1">
            <h3 className="font-medium text-gray-900 mb-2">{reward.name}</h3>
            <div className="flex items-center gap-1 text-brand-teal">
              <img 
                src="/lovable-uploads/b28ed926-e3d1-4215-9e39-e7b91a7ad3f8.png" 
                alt="Points" 
                className="h-4 w-4"
              />
              <span className="font-medium">{formatNumber(reward.points_required)}</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{reward.description}</p>
      </div>
    </div>
  );
};

export default RewardCard;
