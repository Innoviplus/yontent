
export const useReviewCardAspectRatio = (
  reviewId: string, 
  hasImages: boolean, 
  hasVideos: boolean
) => {
  // Generate dynamic aspect ratio based on various factors
  const getAspectRatio = () => {
    if (!hasImages && !hasVideos) {
      return null; // No aspect ratio if no media
    }
    
    // Use review ID to generate a consistent aspect ratio per item
    const seed = reviewId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Create more variation in heights (from 1.2 to 2.0)
    // This will generate taller images like in the reference
    const baseRatio = 1.2;
    const variation = (seed % 100) / 125; // +/- 40% variation
    return baseRatio + variation;
  };

  return getAspectRatio();
};

export default useReviewCardAspectRatio;
