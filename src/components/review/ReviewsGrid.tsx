
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { memo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ReviewsGridProps {
  reviews: Review[];
}

// Memoize the component to prevent unnecessary re-renders
const ReviewsGrid = memo(({ reviews }: ReviewsGridProps) => {
  const navigate = useNavigate();
  const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set reviews when the data is available
    if (reviews.length > 0) {
      setLoadedReviews(reviews);
      setIsLoading(false);
    }
  }, [reviews]);

  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
    navigate(`/review/${reviewId}`);
  };

  useEffect(() => {
    // Apply masonry layout after reviews are loaded
    if (!isLoading && gridRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (gridRef.current) {
          applyMasonryLayout();
        }
      });
      
      resizeObserver.observe(gridRef.current);
      applyMasonryLayout();
      
      return () => {
        if (gridRef.current) {
          resizeObserver.unobserve(gridRef.current);
        }
      };
    }
  }, [isLoading, loadedReviews]);

  // Function to apply masonry layout
  const applyMasonryLayout = () => {
    if (!gridRef.current) return;
    
    const grid = gridRef.current;
    const items = grid.getElementsByClassName('masonry-item');
    
    // Reset positions
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      item.style.gridRowEnd = '';
    }
    
    // Set new positions
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      const rowSpan = Math.ceil(item.getBoundingClientRect().height / 10); // 10px grid row height
      item.style.gridRowEnd = `span ${rowSpan}`;
    }
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="mb-3 animate-pulse">
            <div className="bg-gray-200 h-40 rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-4 rounded mb-2 w-3/4"></div>
            <div className="bg-gray-200 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="masonry-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridAutoRows: '10px',
        gap: '12px'
      }}
    >
      {loadedReviews.map((review) => (
        <div 
          key={review.id} 
          className="masonry-item"
          onClick={() => handleReviewClick(review.id)} 
          style={{ marginBottom: 0 }}
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
});

ReviewsGrid.displayName = 'ReviewsGrid';

export default ReviewsGrid;
