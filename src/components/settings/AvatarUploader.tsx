
import React, { useState, useEffect, RefObject } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

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
    console.log("AvatarUploader received avatarUrl:", avatarUrl);
    if (avatarUrl) {
      setPreview(avatarUrl);
    }
  }, [avatarUrl]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected in handleFileChange");
      return;
    }
    
    console.log("File selected in handleFileChange:", file.name, "Type:", file.type, "Size:", (file.size / 1024).toFixed(2), "KB");
    
    try {
      // Show a preview before actual upload
      const objectUrl = URL.createObjectURL(file);
      console.log("Created object URL for preview:", objectUrl);
      setPreview(objectUrl);
      
      // Call the upload handler
      await handleAvatarUpload(e);
      console.log("Avatar upload complete in handleFileChange");
    } catch (error: any) {
      console.error("Error handling file:", error);
      toast.error(`Upload failed: ${error.message || "Unknown error"}`);
      // Revert to previous preview on error
      setPreview(avatarUrl);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-32 h-32 mb-4 border-2 border-gray-200">
        <AvatarImage src={preview || ''} alt={username || 'User'} />
        <AvatarFallback className="bg-primary/10">
          {username ? username.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="relative">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
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
      {!avatarUrl && !preview && !uploading && (
        <p className="text-xs text-gray-500 mt-2">Upload an image to personalize your profile</p>
      )}
    </div>
  );
};
