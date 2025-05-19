
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { memo, useState, useEffect, useRef, useCallback } from 'react';
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
  
  // Only set reviews when the data is available
  useEffect(() => {
    if (reviews.length > 0) {
      setLoadedReviews(reviews);
      setIsLoading(false);
    }
  }, [reviews]);

  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
    navigate(`/review/${reviewId}`);
  };

  // Get the optimal number of columns based on viewport width
  const getColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) return 2; // Mobile: 2 columns
    if (width < 768) return 3; // Small tablet: 3 columns
    if (width < 1024) return 4; // Tablet: 4 columns
    return 5; // Desktop: 5 columns
  }, []);

  // Create an improved masonry layout function
  const createMasonryLayout = useCallback(() => {
    const grid = gridRef.current;
    if (!grid || isLoading) return;

    // Calculate columns based on viewport width
    const columns = getColumnCount();
    const items = Array.from(grid.children) as HTMLElement[];
    const columnHeights = Array(columns).fill(0);
    const columnGap = 12; // Gap between items (in pixels)
    
    // Position each item
    items.forEach((item) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      const x = `${(shortestColumnIndex / columns) * 100}%`;
      const y = `${columnHeights[shortestColumnIndex]}px`;
      
      // Position the item
      item.style.position = 'absolute';
      item.style.left = x;
      item.style.top = y;
      item.style.width = `${100 / columns}%`;
      item.style.padding = '0 6px';
      
      // Update the column height
      // We need to wait a bit for the image to render to get accurate height
      setTimeout(() => {
        columnHeights[shortestColumnIndex] += item.offsetHeight + columnGap;
        
        // Update the grid height to the height of the tallest column
        grid.style.height = `${Math.max(...columnHeights)}px`;
      }, 10);
    });
    
    // Initial grid height (will be updated as items load)
    grid.style.height = `${Math.max(...columnHeights)}px`;
  }, [isLoading, getColumnCount]);

  // Initialize and clean up layout effect
  useEffect(() => {
    const handleResize = () => {
      // Use requestAnimationFrame for better performance during resize
      requestAnimationFrame(createMasonryLayout);
    };

    // Clean up existing observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }
    
    // Only create layout when reviews are loaded and grid exists
    if (!isLoading && gridRef.current && loadedReviews.length > 0) {
      // Create the initial layout
      createMasonryLayout();
      
      // Set up observer for responsive layout
      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(gridRef.current);
      
      // Add window resize listener for viewport changes
      window.addEventListener('resize', handleResize);
    }
    
    // Clean up function
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [createMasonryLayout, isLoading, loadedReviews]);

  // Handle image load events to recalculate layout
  useEffect(() => {
    const handleImageLoad = () => {
      if (!isLoading) {
        createMasonryLayout();
      }
    };

    // Wait for all images to load before calculating final layout
    const images = document.querySelectorAll('.masonry-container img');
    images.forEach(img => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
      }
    });

    // Clean up event listeners
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, [isLoading, loadedReviews, createMasonryLayout]);

  // Render loading skeleton when no reviews are available
  if (isLoading && reviews.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="mb-3">
            <Skeleton className="h-60 rounded-lg mb-2" />
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
      className="masonry-container relative min-h-[600px]"
      style={{ position: 'relative', width: '100%' }}
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
