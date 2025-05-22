
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/lib/types';

interface ReviewCardUserInfoProps {
  user?: UserType;
}

const ReviewCardUserInfo = ({ user }: ReviewCardUserInfoProps) => {
  return (
    <div className="flex items-center mb-1.5">
      <Avatar className="h-5 w-5 mr-1.5">
        <AvatarImage src={user?.avatar || ''} alt={user?.username || 'User'} />
        <AvatarFallback>
          <User className="h-2.5 w-2.5" />
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500 truncate max-w-[100px]">
        {user?.username || 'Anonymous'}
      </span>
    </div>
  );
};

export default ReviewCardUserInfo;
