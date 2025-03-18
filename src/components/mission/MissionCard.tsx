
import { Award, Clock, ArrowRight, Store, Camera } from 'lucide-react';
import { Mission } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format, isPast } from 'date-fns';

interface MissionCardProps {
  mission: Mission;
  className?: string;
}

const MissionCard = ({ mission, className }: MissionCardProps) => {
  const isExpired = mission.expiresAt ? isPast(mission.expiresAt) : false;
  const isCompleted = mission.status === 'COMPLETED';
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl overflow-hidden border relative transition-all",
        isCompleted 
          ? "border-brand-teal shadow-sm" 
          : isExpired 
            ? "border-gray-200 opacity-70" 
            : "border-gray-200 hover:border-brand-teal/50 shadow-card card-hover",
        className
      )}
    >
      {/* Banner image */}
      {mission.bannerImage && (
        <div className="h-40 w-full bg-gray-100 overflow-hidden">
          <img 
            src={mission.bannerImage} 
            alt={mission.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Merchant logo if available */}
      {mission.merchantLogo && (
        <div className="absolute -top-1 -left-1 w-16 h-16 p-1 bg-white rounded-br-xl rounded-tl-xl shadow-sm flex items-center justify-center">
          <img 
            src={mission.merchantLogo} 
            alt={mission.merchantName || 'Merchant'} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      
      {/* Status indicator */}
      {isCompleted && (
        <div className="absolute -top-1 -right-1 bg-brand-teal text-white text-xs font-medium px-2 py-0.5 rounded-bl-md rounded-tr-md">
          Completed
        </div>
      )}
      
      {isExpired && !isCompleted && (
        <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs font-medium px-2 py-0.5 rounded-bl-md rounded-tr-md">
          Expired
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between mb-2">
          <div className="chip chip-secondary flex items-center gap-1">
            {mission.type === 'REVIEW' ? 
              <>
                <Camera className="h-3 w-3" />
                <span>Write a Review</span>
              </> : 
              <>
                <Store className="h-3 w-3" />
                <span>Submit Receipt</span>
              </>
            }
          </div>
          <div className="flex items-center text-brand-teal font-semibold">
            <Award className="h-4 w-4 mr-1" />
            <span>{mission.pointsReward} pts</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-brand-slate mb-2">{mission.title}</h3>
        
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{mission.description}</p>
        
        <div className="border-t border-gray-100 pt-3 mt-1">
          <div className="flex justify-between items-center">
            {mission.expiresAt && (
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {isExpired ? 'Expired on ' : 'Expires '} 
                  {format(mission.expiresAt, 'MMM d, yyyy')}
                </span>
              </div>
            )}
            
            {!isCompleted && !isExpired && (
              <Link 
                to={`/missions/${mission.id}`}
                className="flex items-center text-sm font-medium text-brand-teal hover:text-brand-darkTeal transition-colors"
              >
                <span>View mission</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}
            
            {isCompleted && (
              <span className="text-sm font-medium text-brand-teal">
                Completed
              </span>
            )}
            
            {isExpired && !isCompleted && (
              <span className="text-sm font-medium text-gray-500">
                No longer available
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
