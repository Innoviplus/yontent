
import React from 'react';

interface ReceiptImageGalleryProps {
  images: string[];
}

const ReceiptImageGallery: React.FC<ReceiptImageGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <a 
          key={index} 
          href={image} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block overflow-hidden rounded-md border"
        >
          <img 
            src={image} 
            alt={`Receipt ${index + 1}`} 
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity" 
          />
        </a>
      ))}
    </div>
  );
};

export default ReceiptImageGallery;
