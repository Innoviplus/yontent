
import React, { useRef } from 'react';
import { AvatarUploader, AvatarUploaderProps } from './AvatarUploader';

interface AvatarSectionProps extends Omit<AvatarUploaderProps, 'fileInputRef'> {
  username?: string;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl,
  uploading,
  handleAvatarUpload,
  username,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center">
      <AvatarUploader
        avatarUrl={avatarUrl}
        username={username}
        uploading={uploading}
        handleAvatarUpload={handleAvatarUpload}
        fileInputRef={fileInputRef}
      />
    </div>
  );
};
