
import { useState } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadSectionProps {
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreviewUrls: string[];
  setImagePreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  imageError: string | null;
  setImageError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploadSection = ({
  selectedImages,
  setSelectedImages,
  imagePreviewUrls,
  setImagePreviewUrls,
  imageError,
  setImageError
}: ImageUploadSectionProps) => {
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to a maximum of 10 images total
      const availableSlots = 10 - selectedImages.length;
      const filesToAdd = newFiles.slice(0, availableSlots);
      
      if (filesToAdd.length > 0) {
        setSelectedImages((prevImages) => [...prevImages, ...filesToAdd]);
        
        // Create preview URLs for the images
        const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
        setImagePreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
        
        // Clear any previous image errors if we now have at least one image
        if ([...selectedImages, ...filesToAdd].length > 0) {
          setImageError(null);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    // Remove the image and its preview
    setSelectedImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      
      // If we removed the last image, set an error
      if (newImages.length === 0) {
        setImageError("At least one image is required");
      }
      
      return newImages;
    });
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prevUrls => {
      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Images <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500">At least 1 image is required (maximum 10)</p>
      
      {/* Image Previews */}
      {imagePreviewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={url} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-gray-800/70 text-white rounded-full p-1"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
            imageError ? 'border-red-300' : 'border-gray-300'
          } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max 10 photos)</p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
            disabled={imagePreviewUrls.length >= 10}
          />
        </label>
      </div>
      
      {imageError && (
        <p className="text-xs text-red-500">{imageError}</p>
      )}
      
      {imagePreviewUrls.length >= 10 && (
        <p className="text-xs text-amber-600">Maximum of 10 images reached</p>
      )}
    </div>
  );
};

export default ImageUploadSection;
