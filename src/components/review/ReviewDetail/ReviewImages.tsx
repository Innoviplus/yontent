
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface ReviewImagesProps {
  images: string[];
}

const ReviewImages = ({ images }: ReviewImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((current) => 
      current === images.length - 1 ? 0 : current + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((current) => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  if (images.length === 0) return null;

  return (
    <div className="relative h-96 bg-gray-100">
      <img 
        src={images[currentImageIndex]} 
        alt={`Review image ${currentImageIndex + 1}`} 
        className="w-full h-full object-contain"
      />
      
      {/* Image nav buttons (only if more than 1 image) */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Image indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewImages;
