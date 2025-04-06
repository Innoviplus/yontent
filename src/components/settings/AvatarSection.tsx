
import React, { useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarSectionProps {
  avatarUrl: string | null;
  username?: string;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl,
  username,
  uploading,
  handleAvatarUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const triggerAvatarUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      toast.error("Cannot access file input");
    }
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-32 h-32 mb-4 border-2 border-gray-200">
        <AvatarImage src={avatarUrl || ''} alt={username || 'User'} />
        <AvatarFallback className="bg-primary/10">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="relative">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleAvatarUpload}
          className="hidden"
          id="avatar-upload"
          disabled={uploading}
          ref={fileInputRef}
        />
        <Button
          variant="primary"
          className="relative"
          asChild
          disabled={uploading}
        >
          <label htmlFor="avatar-upload" className="cursor-pointer flex items-center">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Change Avatar'}
          </label>
        </Button>
      </div>
      {!avatarUrl && !uploading && (
        <p className="text-xs text-gray-500 mt-2">Upload an image to personalize your profile</p>
      )}
    </div>
  );
};
