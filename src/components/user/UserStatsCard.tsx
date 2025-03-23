
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/formatUtils';
import { User } from '@/lib/types';

export interface UserStats {
  reviewsCount: number;
  followersCount: number;
  followingCount: number;
  pointsCount: number;
}

interface UserStatsCardProps {
  user: User;
  stats: UserStats;
  className?: string;
  variant?: 'default' | 'compact';
}

const UserStatsCard = ({ 
  user, 
  stats, 
  className = '', 
  variant = 'default' 
}: UserStatsCardProps) => {
  return (
    <Card className={className}>
      <CardContent className={`${variant === 'compact' ? 'p-4' : 'p-6'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3">
            <div className="text-2xl font-semibold text-brand-slate">{formatNumber(stats.reviewsCount)}</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          
          <Link to={`/followers/${user.id}`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
            <div className="text-2xl font-semibold text-brand-slate group-hover:text-brand-teal transition-colors">
              {formatNumber(stats.followersCount)}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors">Followers</div>
          </Link>
          
          <Link to={`/following/${user.id}`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
            <div className="text-2xl font-semibold text-brand-slate group-hover:text-brand-teal transition-colors">
              {formatNumber(stats.followingCount)}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors">Following</div>
          </Link>
          
          <Link to="/redeem" className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
            <div className="flex items-center justify-center gap-1">
              <img 
                src="/lovable-uploads/87f7987e-62e4-4871-b384-8c77779df418.png" 
                alt="Points" 
                className="h-5 w-5" 
              />
              <span className="text-2xl font-semibold text-brand-teal group-hover:text-brand-teal/80 transition-colors">
                {formatNumber(stats.pointsCount)}
              </span>
            </div>
            <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors">Points</div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStatsCard;
