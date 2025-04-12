
import { useState } from 'react';

export const useReviewMediaValidation = () => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Custom image selection handler that sets error if too many files are selected
  const validateImageSelection = (files: FileList | null, currentCount: number, maxCount: number = 10) => {
    if (!files) return false;
    
    if (currentCount + files.length > maxCount) {
      setImageError(`You can only upload up to ${maxCount} images. Please select fewer images.`);
      return false;
    }
    
    setImageError(null);
    return true;
  };
  
  // Validate for image requirements
  const validateImageRequirements = (selectedCount: number, existingCount: number, isDraft: boolean) => {
    const totalImageCount = selectedCount + existingCount;
    
    if (totalImageCount > 10) {
      setImageError(`You can only upload up to 10 images. Please remove ${totalImageCount - 10} images.`);
      return false;
    }
    
    // For published reviews, validate that at least one image is selected or exists
    if (!isDraft && totalImageCount === 0) {
      setImageError("At least one image is required");
      return false;
    }
    
    return true;
  };
  
  return {
    imageError,
    setImageError,
    videoError,
    setVideoError,
    validateImageSelection,
    validateImageRequirements
  };
};
