
import React, { useState } from 'react';
import { Loader2, Image as ImageIcon, X, Move } from 'lucide-react';

interface ImageUploadProps {
  imagePreviewUrls: string[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages?: (newOrder: string[]) => void;
  error: string | null;
  uploading: boolean;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imagePreviewUrls, 
  onFileSelect, 
  onRemoveImage, 
  onReorderImages,
  error, 
  uploading,
  maxImages = 10
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // Validate maximum number of images
    if (files && imagePreviewUrls.length + files.length > maxImages) {
      // Clear the input
      e.target.value = '';
      // Call onFileSelect with null to indicate error
      onFileSelect(null);
      // We're assuming the parent component will handle setting the error message
      return;
    }
    
    onFileSelect(files);
  };

  // Create an array of empty slots to show all possible upload positions
  const emptySlots = maxImages - imagePreviewUrls.length;

  // Drag and drop handlers for reordering
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('opacity-50');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(null);
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('opacity-50');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (dragIndex === dropIndex) return;
    
    const newImageOrder = [...imagePreviewUrls];
    const movedImage = newImageOrder[dragIndex];
    newImageOrder.splice(dragIndex, 1);
    newImageOrder.splice(dropIndex, 0, movedImage);
    
    if (onReorderImages) {
      onReorderImages(newImageOrder);
    }
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveImage(index);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Images</h3>
        <span className="text-sm text-gray-500">Add up to {maxImages} images ({imagePreviewUrls.length}/{maxImages})</span>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        {imagePreviewUrls.map((url, index) => (
          <div 
            key={`image-${index}`} 
            className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden group cursor-move"
            draggable={!uploading}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
          >
            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => handleRemoveImage(index, e)}
              disabled={uploading}
              aria-label="Remove image"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md opacity-80 hover:opacity-100 transition-opacity z-10"
            >
              <X className="h-3 w-3" />
            </button>
            {!uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Move className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {Array.from({ length: emptySlots }).map((_, index) => (
          <label 
            key={`slot-${index}`} 
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              multiple
              disabled={uploading}
            />
            <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Add</span>
          </label>
        ))}
      </div>
      
      {uploading && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Uploading images...
        </div>
      )}
      
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      
      {imagePreviewUrls.length > 0 && (
        <p className="text-xs text-gray-500 italic">
          <Move className="h-3 w-3 inline mr-1" /> Drag and drop to reorder images
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
