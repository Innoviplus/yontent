
import React, { useState, useEffect, RefObject } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';

export interface AvatarUploaderProps {
  avatarUrl: string | null;
  username?: string;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  fileInputRef?: RefObject<HTMLInputElement>;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  username,
  uploading,
  handleAvatarUpload,
  fileInputRef: externalFileInputRef
}) => {
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const internalFileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Use the external ref if provided, otherwise use the internal one
  const fileInputRef = externalFileInputRef || internalFileInputRef;

  // Update preview when avatarUrl changes
  useEffect(() => {
    if (avatarUrl) {
      setPreview(avatarUrl);
    }
  }, [avatarUrl]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", e.target.files?.[0]?.name);
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Show a preview before actual upload
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Call the upload handler directly - no more cropping that might cause issues
      await handleAvatarUpload(e);
      console.log("Avatar upload complete");
    } catch (error) {
      console.error("Error handling file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-32 h-32 mb-4">
        <AvatarImage src={preview || ''} alt={username || 'User'} />
        <AvatarFallback>{username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <div className="relative">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="avatar-upload"
          disabled={uploading}
          ref={fileInputRef}
        />
        <Button
          variant="outline"
          className="relative"
          asChild
          disabled={uploading}
        >
          <label htmlFor="avatar-upload">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            {uploading ? 'Uploading...' : 'Change Avatar'}
          </label>
        </Button>
      </div>
    </div>
  );
};
