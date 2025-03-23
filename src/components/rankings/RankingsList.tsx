
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RankedUser, RankingType } from './types';
import { format } from 'date-fns';
import { Eye, Heart, Trophy, Award } from 'lucide-react';
import { formatNumber } from '@/lib/formatUtils';

interface RankingsListProps {
  users: RankedUser[];
  activeTab: RankingType;
}

const RankingsList = ({ users, activeTab }: RankingsListProps) => {
  const getRankingIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="text-yellow-500 h-5 w-5" />;
    } else if (rank === 2) {
      return <Trophy className="text-gray-400 h-5 w-5" />;
    } else if (rank === 3) {
      return <Trophy className="text-amber-700 h-5 w-5" />;
    }
    return <span className="text-gray-500 font-medium">{rank}</span>;
  };
  
  const getStatIcon = () => {
    switch (activeTab) {
      case 'points': 
        return <Award className="h-4 w-4" />;
      case 'views': 
        return <Eye className="h-4 w-4" />;
      case 'likes': 
        return <Heart className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Link 
          key={user.id} 
          to={`/user/${user.username}`}
          className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-center w-10 mr-4">
            {getRankingIcon(user.rank)}
          </div>
          
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-medium">{user.username}</h3>
            <p className="text-sm text-gray-500">
              Joined {format(user.createdAt, 'MMM yyyy')}
            </p>
          </div>
          
          <div className="text-right">
            {activeTab === 'points' ? (
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/87f7987e-62e4-4871-b384-8c77779df418.png" 
                  alt="Points" 
                  className="w-4 h-4 mr-1"
                />
                <span className="font-medium text-brand-teal">{formatNumber(user.stats)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-700">
                {getStatIcon()}
                <span className="font-medium">{formatNumber(user.stats)}</span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RankingsList;
