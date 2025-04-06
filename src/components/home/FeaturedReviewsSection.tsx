
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/lib/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeaturedReviewsSectionProps {
  loading?: boolean;
}

const FeaturedReviewsSection = ({ loading: initialLoading }: FeaturedReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading || true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            user_id,
            content,
            images,
            views_count,
            likes_count,
            created_at,
            profiles(
              id,
              username,
              avatar,
              points,
              created_at
            )
          `)
          .eq('status', 'PUBLISHED') // Only fetch PUBLISHED reviews
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error('Error fetching reviews:', error);
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
          productName: 'Review',
          rating: 5,
          user: review.profiles ? {
            id: review.profiles.id,
            username: review.profiles.username || 'Anonymous',
            email: '',
            points: review.profiles.points || 0,
            createdAt: new Date(review.profiles.created_at),
            avatar: review.profiles.avatar
          } : undefined
        }));
        
        setReviews(transformedReviews);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Hide section completely when no reviews are available and loading is complete
  if ((!loading && reviews.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-slate/10 rounded-full mb-2">
              <span className="text-sm font-medium text-brand-slate">Featured</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Recent Reviews</h2>
          </div>
          <Link to="/reviews" className="flex items-center text-brand-slate hover:text-brand-lightSlate transition-colors">
            <span className="font-medium">View all</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-4 space-x-6">
            {reviews.map((review) => (
              <div key={review.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedReviewsSection;
