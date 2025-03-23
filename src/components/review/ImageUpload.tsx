
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ImageUploadProps {
  imagePreviewUrls: string[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  error: string | null;
  uploading: boolean;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imagePreviewUrls, 
  onFileSelect, 
  onRemoveImage, 
  error, 
  uploading,
  maxImages = 10
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Images</h3>
        <span className="text-sm text-gray-500">Add up to {maxImages} images</span>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {imagePreviewUrls.map((url, index) => (
          <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md"
              onClick={() => onRemoveImage(index)}
              disabled={uploading}
            >
              ×
            </button>
          </div>
        ))}
        
        {imagePreviewUrls.length < maxImages && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files)}
              multiple
              disabled={uploading}
            />
            <span className="text-3xl text-gray-400">+</span>
          </label>
        )}
      </div>
      
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
