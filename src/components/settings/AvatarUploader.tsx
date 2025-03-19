
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploaderProps {
  avatarUrl: string | null;
  username?: string;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  username,
  uploading,
  handleAvatarUpload
}) => {
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show a preview before actual upload
    const objectUrl = URL.createObjectURL(file);
    
    // Create image to get dimensions for cropping
    const img = new Image();
    img.onload = async () => {
      // Create canvas for square crop
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Determine dimensions for square crop
      const size = Math.min(img.width, img.height);
      const xOffset = (img.width - size) / 2;
      const yOffset = (img.height - size) / 2;
      
      // Set canvas size to square
      canvas.width = size;
      canvas.height = size;
      
      // Draw cropped image on canvas
      ctx.drawImage(
        img,
        xOffset, yOffset, size, size,
        0, 0, size, size
      );
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        // Create new file from blob
        const croppedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        
        // Create new event with cropped file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(croppedFile);
        
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          
          // Use the preview immediately
          setPreview(canvas.toDataURL());
          
          // Trigger the upload handler with the modified input
          await handleAvatarUpload(e);
        }
      }, file.type);
    };
    
    img.src = objectUrl;
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
