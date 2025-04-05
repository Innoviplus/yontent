
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Mission } from '@/lib/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionBannerProps {
  mission: Mission;
}

const MissionBanner = ({ mission }: MissionBannerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full bg-gray-100 pt-16 md:pt-20">
      <AspectRatio ratio={16/9} className="w-full">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${mission.bannerImage || '/placeholder.svg'})` 
          }}
        >
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <Link to="/missions" className="text-white flex items-center mb-4 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to all missions
            </Link>
            
            <div className="flex items-center mb-2">
              {mission.merchantLogo && (
                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-white mr-3">
                  <img 
                    src={mission.merchantLogo} 
                    alt={mission.merchantName || 'Brand'} 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="text-white text-sm font-medium">
                {mission.merchantName || 'Mission Sponsor'}
              </div>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white">{mission.title}</h1>
          </div>
        </div>
      </AspectRatio>
    </div>
  );
};

export default MissionBanner;
