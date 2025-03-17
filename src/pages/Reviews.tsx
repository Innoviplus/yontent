
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Loader2, SortAsc } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { trackReviewView } from '@/services/reviewService';

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'relevant', label: 'Most Relevant' }
];

const fetchReviews = async (sortBy: string, userId?: string) => {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        product_name,
        rating,
        content,
        images,
        views_count,
        likes_count,
        created_at,
        profiles:user_id (
          id,
          username,
          avatar
        )
      `);

    // Apply sorting
    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'relevant' && userId) {
      // For 'relevant' sorting, we'll first need to track what the user has viewed
      // This is a simplified implementation - in a real app, you'd have a more sophisticated algorithm
      // and might use a dedicated recommendation system
      
      // For now, we'll still sort by created_at as a fallback
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to load reviews');
    }
    
    // Transform the reviews to match our Review type
    const transformedReviews: Review[] = data.map(review => ({
      id: review.id,
      userId: review.user_id,
      productName: review.product_name,
      rating: review.rating,
      content: review.content,
      images: review.images || [],
      viewsCount: review.views_count,
      likesCount: review.likes_count,
      createdAt: new Date(review.created_at),
      user: review.profiles ? {
        id: review.profiles.id,
        username: review.profiles.username || 'Anonymous',
        email: '', // Not returned for privacy
        points: 0, // Not relevant in this context
        createdAt: new Date(), // Not relevant in this context
        avatar: review.profiles.avatar
      } : undefined
    }));
    
    return transformedReviews;
  } catch (error) {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};

const Reviews = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<string>('recent');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const { data: reviews, isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', sortBy, user?.id],
    queryFn: () => fetchReviews(sortBy, user?.id),
  });

  // Handle review click/view to track for relevance
  const handleReviewClick = (reviewId: string) => {
    if (user) {
      trackReviewView(reviewId);
    }
  };

  // Calculate pagination
  const totalPages = reviews ? Math.ceil(reviews.length / itemsPerPage) : 0;
  const paginatedReviews = reviews ? 
    reviews.slice((page - 1) * itemsPerPage, page * itemsPerPage) : 
    [];

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page when changing sort
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Reviews</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Sort Select */}
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {user && (
              <Link to="/submit-review" className="w-full sm:w-auto">
                <Button className="bg-brand-teal hover:bg-brand-teal/90 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading reviews</h3>
            <p className="text-gray-600 mb-6">
              We encountered a problem while loading the reviews. Please try again.
            </p>
            <Button onClick={() => refetch()} className="bg-brand-teal hover:bg-brand-teal/90">
              Retry
            </Button>
          </div>
        ) : paginatedReviews.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedReviews.map((review) => (
                <div key={review.id} onClick={() => handleReviewClick(review.id)}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink 
                        onClick={() => setPage(index + 1)} 
                        isActive={page === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                      className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your product experience with the community!
            </p>
            {user ? (
              <Link to="/submit-review">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  Submit Your First Review
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  Login to Submit Review
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
