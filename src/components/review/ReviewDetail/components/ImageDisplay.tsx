
import React from 'react';

interface ImageDisplayProps {
  imageSrc: string;
  imageIndex: number;
  totalImages: number;
}

const ImageDisplay = ({ 
  imageSrc, 
  imageIndex, 
  totalImages
}: ImageDisplayProps) => {
  return (
    <div className="relative w-full h-full">
      <img 
        src={imageSrc} 
        alt={`Review image ${imageIndex + 1}`}
        className="w-full h-full object-contain"
      />
      
      {totalImages > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs py-1 px-2 rounded-full z-10">
          {imageIndex + 1} / {totalImages}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
