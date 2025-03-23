
import React from 'react';
import { Loader2, Image as ImageIcon, X } from 'lucide-react';

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
          <div key={index} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden group">
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => onRemoveImage(index)}
              disabled={uploading}
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {imagePreviewUrls.length < maxImages && (
          <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files)}
              multiple
              disabled={uploading}
            />
            <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Add</span>
          </label>
        )}
      </div>
      
      {uploading && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Uploading images...
        </div>
      )}
      
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
