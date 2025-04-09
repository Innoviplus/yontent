
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
  isCurrentUser?: boolean;
}
const UserStatsCard = ({
  user,
  stats,
  className = '',
  variant = 'default',
  isCurrentUser = false
}: UserStatsCardProps) => {
  return <Card className={className}>
      <CardContent className={`${variant === 'compact' ? 'p-4' : 'p-6'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3 text-center">
            <div className="text-2xl font-semibold text-brand-slate text-center">{formatNumber(stats.reviewsCount)}</div>
            <div className="text-sm text-gray-500 text-center">Reviews</div>
          </div>
          
          <Link to={`/user/${user.username}/followers`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
            <div className="text-2xl font-semibold text-brand-slate group-hover:text-brand-teal transition-colors text-center">
              {formatNumber(stats.followersCount)}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors text-center">Followers</div>
          </Link>
          
          <Link to={`/user/${user.username}/following`} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
            <div className="text-2xl font-semibold text-brand-slate group-hover:text-brand-teal transition-colors text-center">
              {formatNumber(stats.followingCount)}
            </div>
            <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors text-center">Following</div>
          </Link>
          
          {isCurrentUser ? (
            <Link to="/rewards" className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors group">
              <div className="flex items-center justify-center gap-1">
                <img alt="Points" width="20" height="20" className="h-5 w-5" src="/lovable-uploads/8273d306-96cc-45cd-a7d8-ded89e18e195.png" />
                <span className="text-2xl font-semibold text-brand-teal group-hover:text-brand-teal/80 transition-colors text-center">
                  {formatNumber(stats.pointsCount)}
                </span>
              </div>
              <div className="text-sm text-gray-500 group-hover:text-brand-teal/80 transition-colors text-center">Points</div>
            </Link>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <img alt="Points" width="20" height="20" className="h-5 w-5" src="/lovable-uploads/1f90692d-9a7e-4deb-a401-0e1ebe07bdfb.png" />
                <span className="text-2xl font-semibold text-brand-teal text-center">
                  {formatNumber(stats.pointsCount)}
                </span>
              </div>
              <div className="text-sm text-gray-500 text-center">Points</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>;
};
export default UserStatsCard;
