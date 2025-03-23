
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  label: string;
  imageUrl: string;
  onImageChange: (url: string) => void;
  placeholder: string;
  folderName: string;
  className?: string;
}

const ImageUploader = ({ 
  label, 
  imageUrl, 
  onImageChange, 
  placeholder,
  folderName,
  className
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('rewards')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('rewards')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error: any) {
      console.error(`Error uploading ${folderName} image:`, error);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const file = event.target.files[0];
    setIsUploading(true);
    
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setPreview(imageUrl);
        onImageChange(imageUrl);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Image preview */}
      {preview ? (
        <div className={`relative ${label === 'Logo Image' ? 'w-24 h-24' : 'w-full h-32'} bg-gray-100 rounded-md overflow-hidden group`}>
          <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
          <button
            type="button"
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
            onClick={removeImage}
            disabled={isUploading}
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div 
          className={`flex flex-col items-center justify-center ${label === 'Logo Image' ? 'w-24 h-24' : 'w-full h-32'} bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`h-6 w-6 ${isUploading ? 'animate-bounce text-blue-500' : 'text-gray-400'}`} />
          <span className="mt-1 text-xs text-gray-500">
            {isUploading ? 'Uploading...' : placeholder}
          </span>
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      
      <p className="text-xs text-gray-500">
        Or enter image URL directly:
      </p>
      
      <Input
        placeholder="https://example.com/image.png"
        value={imageUrl || ''}
        onChange={(e) => {
          onImageChange(e.target.value);
          setPreview(e.target.value || null);
        }}
      />
    </div>
  );
};

export default ImageUploader;
