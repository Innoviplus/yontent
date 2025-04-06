
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ParticipationStatusBadge from '../ParticipationStatusBadge';

interface ParticipationUserInfoProps {
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  status: string;
}

const ParticipationUserInfo: React.FC<ParticipationUserInfoProps> = ({
  userName,
  userAvatar,
  createdAt,
  status
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format the date properly
  const formattedDate = createdAt instanceof Date 
    ? createdAt.toLocaleString() 
    : new Date(createdAt).toLocaleString();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={userName} />
          ) : null}
          <AvatarFallback>{getInitials(userName || "")}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-muted-foreground">
            {formattedDate}
          </p>
        </div>
      </div>
      <ParticipationStatusBadge status={status} />
    </div>
  );
};

export default ParticipationUserInfo;
