
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RankedUser, RankingType } from './types';
import { Eye, Heart, Trophy, Award } from 'lucide-react';
import { formatNumber } from '@/lib/formatUtils';
import { Button } from '@/components/ui/button';

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
  
  // Filter out Anonymous users
  const filteredUsers = users.filter(user => user.username !== 'Anonymous');
  
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {filteredUsers.map((user) => (
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
            <div className="flex items-center text-sm text-gray-600">
              {getStatIcon()}
              <span className="ml-1">{formatNumber(user.stats)}</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="min-w-[100px]"
          >
            Follow
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default RankingsList;
