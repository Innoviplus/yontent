import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2, ArrowDown, ArrowUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type SortOption = 'recent' | 'views' | 'relevant';

const ITEMS_PER_PAGE = 20;

const ReviewFeed = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchReviews = async (pageNum: number, sort: SortOption) => {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          views_count,
          likes_count,
          avg_time_spent,
          click_through_rate,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      switch (sort) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'views':
          query = query.order('views_count', { ascending: false });
          break;
        case 'relevant':
          query = query.order('views_count', { ascending: false });
          break;
      }
        
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        return;
      }
      
      const transformedReviews: Review[] = data.map(review => ({
        id: review.id,
        userId: review.user_id,
        content: review.content,
        images: review.images || [],
        viewsCount: review.views_count,
        likesCount: review.likes_count,
        createdAt: new Date(review.created_at),
        user: review.profiles ? {
          id: review.profiles.id,
          username: review.profiles.username || 'Anonymous',
          avatar: review.profiles.avatar
        } : undefined
      }));

      if (pageNum === 0) {
        setReviews(transformedReviews);
      } else {
        setReviews(prev => [...prev, ...transformedReviews]);
      }
      
      setHasMore(transformedReviews.length === ITEMS_PER_PAGE);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setPage(0);
    fetchReviews(0, sortBy);
  }, [sortBy]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 0) {
      fetchReviews(page, sortBy);
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Review Feed</h1>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Sort by
                  {sortBy === 'recent' && ' Latest'}
                  {sortBy === 'views' && ' Most Viewed'}
                  {sortBy === 'relevant' && ' Most Relevant'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('views')}>
                  Most Viewed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('relevant')}>
                  Most Relevant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <Link to="/submit-review">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {loading && page === 0 ? (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 masonry-grid">
              {reviews.map((review) => (
                <div key={review.id} className="mb-6">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            
            {loading && (
              <div className="flex justify-center items-center mt-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-teal" />
              </div>
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

export default ReviewFeed;
