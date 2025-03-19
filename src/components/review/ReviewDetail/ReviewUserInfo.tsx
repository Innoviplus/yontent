
import { format } from 'date-fns';
import { User, Calendar } from 'lucide-react';
import { User as UserType } from '@/lib/types';

interface ReviewUserInfoProps {
  user?: UserType;
  createdAt: Date;
  onUserClick: () => void;
}

const ReviewUserInfo = ({ user, createdAt, onUserClick }: ReviewUserInfoProps) => {
  return (
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onUserClick}>
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center">
          <User className="h-5 w-5 text-brand-teal" />
        </div>
      )}
      <div>
        <p className="font-medium hover:underline">{user?.username || 'Anonymous'}</p>
        <p className="text-sm text-gray-500 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {format(createdAt, 'MMMM d, yyyy')}
        </p>
      </div>
    </div>
  );
};

export default ReviewUserInfo;
