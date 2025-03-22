
import { Award, Clock, ArrowRight, Users } from 'lucide-react';
import { Mission } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format, isPast } from 'date-fns';
import { Button } from './ui/button';

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
        "bg-white rounded-xl overflow-hidden border relative transition-all flex flex-col",
        isCompleted 
          ? "border-brand-teal shadow-sm" 
          : isExpired 
            ? "border-gray-200 opacity-70" 
            : "border-gray-200 hover:border-brand-teal/50 shadow-card card-hover",
        className
      )}
    >
      {/* Status indicator */}
      {isCompleted && (
        <div className="absolute -top-1 -right-1 bg-brand-teal text-white text-xs font-medium px-2 py-0.5 rounded-bl-md rounded-tr-md z-10">
          Completed
        </div>
      )}
      
      {isExpired && !isCompleted && (
        <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs font-medium px-2 py-0.5 rounded-bl-md rounded-tr-md z-10">
          Expired
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          {mission.merchantLogo && (
            <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 mr-3">
              <img 
                src={mission.merchantLogo} 
                alt={mission.merchantName || 'Brand'} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-500">
              {mission.merchantName || 'Brand Mission'}
            </div>
            <div className="flex items-center text-brand-teal font-semibold">
              <img 
                src="/lovable-uploads/87f7987e-62e4-4871-b384-8c77779df418.png" 
                alt="Points" 
                className="w-4 h-4 mr-1"
              />
              <span>{mission.pointsReward}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-brand-slate mb-2">{mission.title}</h3>
        
        <p className="text-gray-600 mb-4 text-sm flex-1">{mission.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>
              {mission.startDate && format(mission.startDate, 'MMM d, yyyy')} 
              {mission.expiresAt && ' - ' + format(mission.expiresAt, 'MMM d, yyyy')}
            </span>
          </div>
          
          {mission.maxSubmissionsPerUser && (
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>Max submissions: {mission.maxSubmissionsPerUser}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 pt-3 mt-auto">
          {!isCompleted && !isExpired && (
            <Button 
              asChild
              variant="default"
              className="w-full bg-brand-teal hover:bg-brand-teal/90"
            >
              <Link to={`/missions/${mission.id}`} className="flex items-center justify-center">
                <span>Join Mission</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
          
          {isCompleted && (
            <Button 
              asChild
              variant="outline"
              className="w-full border-brand-teal text-brand-teal"
            >
              <Link to={`/missions/${mission.id}`}>
                Completed
              </Link>
            </Button>
          )}
          
          {isExpired && !isCompleted && (
            <Button 
              asChild
              variant="outline"
              className="w-full opacity-50"
            >
              <Link to={`/missions/${mission.id}`}>
                Expired
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
