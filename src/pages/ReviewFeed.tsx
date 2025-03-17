import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ReviewFeed = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
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
            profiles:user_id (
              id,
              username,
              avatar
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching reviews:', error);
          toast.error('Failed to load reviews');
          return;
        }
        
        // Transform the reviews to match our Review type
        const transformedReviews: Review[] = data.map(review => ({
          id: review.id,
          userId: review.user_id,
          productName: "Review", // Default value since column no longer exists
          rating: 5, // Default value since column no longer exists
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
        
        setReviews(transformedReviews);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
    
    // Subscribe to new reviews
    const reviewsSubscription = supabase
      .channel('public:reviews')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'reviews' 
      }, payload => {
        // Fetch the complete review with user info when a new one is added
        supabase
          .from('reviews')
          .select(`
            id,
            user_id,
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
          `)
          .eq('id', payload.new.id)
          .single()
          .then(({ data, error }) => {
            if (error || !data) return;
            
            const newReview: Review = {
              id: data.id,
              userId: data.user_id,
              productName: "Review", // Default value
              rating: 5, // Default value
              content: data.content,
              images: data.images || [],
              viewsCount: data.views_count,
              likesCount: data.likes_count,
              createdAt: new Date(data.created_at),
              user: data.profiles ? {
                id: data.profiles.id,
                username: data.profiles.username || 'Anonymous',
                email: '',
                points: 0,
                createdAt: new Date(),
                avatar: data.profiles.avatar
              } : undefined
            };
            
            setReviews(prevReviews => [newReview, ...prevReviews]);
          });
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(reviewsSubscription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Review Feed</h1>
          
          {user && (
            <Link to="/submit-review">
              <Button className="bg-brand-teal hover:bg-brand-teal/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
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
