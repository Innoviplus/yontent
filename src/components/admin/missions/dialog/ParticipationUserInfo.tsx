
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ParticipationStatusBadge from '../ParticipationStatusBadge';

interface ParticipationUserInfoProps {
  userName: string;
  userAvatar?: string | null;
  createdAt: Date;
  status: string;
}

const ParticipationUserInfo: React.FC<ParticipationUserInfoProps> = ({
  userName,
  userAvatar,
  createdAt,
  status
}) => {
  const formattedDate = createdAt instanceof Date 
    ? createdAt.toLocaleString() 
    : new Date(createdAt).toLocaleString();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={userName} />
          ) : null}
          <AvatarFallback>{getInitials(userName || "?")}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-lg">{userName || "Unknown User"}</h3>
          <p className="text-sm text-muted-foreground">
            Submitted on {formattedDate}
          </p>
        </div>
      </div>
      <ParticipationStatusBadge status={status} />
    </div>
  );
};

export default ParticipationUserInfo;
