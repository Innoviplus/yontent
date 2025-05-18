
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { memo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewsGridProps {
  reviews: Review[];
}

// Memoize the component to prevent unnecessary re-renders
const ReviewsGrid = memo(({ reviews }: ReviewsGridProps) => {
  const navigate = useNavigate();
  const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

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
    // Clean up any existing resize observer to prevent memory leaks
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    // Only initialize after reviews are loaded and DOM is ready
    if (!isLoading && gridRef.current) {
      // Initial layout application
      applyMasonryLayout();
      
      // Create and save the observer instance
      resizeObserverRef.current = new ResizeObserver(() => {
        requestAnimationFrame(applyMasonryLayout);
      });
      
      // Observe the grid and all masonry items for any resize changes
      resizeObserverRef.current.observe(gridRef.current);
      
      // Also add window resize listener
      window.addEventListener('resize', applyMasonryLayout);
    }
    
    // Clean up function
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', applyMasonryLayout);
    };
  }, [isLoading, loadedReviews]);

  // Function to apply masonry layout with performance optimizations
  const applyMasonryLayout = () => {
    if (!gridRef.current) return;
    
    const grid = gridRef.current;
    const items = grid.querySelectorAll('.masonry-item');
    
    // Using a more efficient approach to set positions
    items.forEach((item) => {
      const itemElement = item as HTMLElement;
      const height = itemElement.getBoundingClientRect().height;
      const rowSpan = Math.ceil(height / 10);
      
      if (itemElement.style.gridRowEnd !== `span ${rowSpan}`) {
        itemElement.style.gridRowEnd = `span ${rowSpan}`;
      }
    });
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="mb-3">
            <Skeleton className="h-40 rounded-lg mb-2" />
            <Skeleton className="h-4 rounded mb-2 w-3/4" />
            <Skeleton className="h-3 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={gridRef}
      className="masonry-grid"
    >
      {loadedReviews.map((review) => (
        <div 
          key={review.id} 
          className="masonry-item"
          onClick={() => handleReviewClick(review.id)}
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
});

ReviewsGrid.displayName = 'ReviewsGrid';

export default ReviewsGrid;
