import { useEffect, useState } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import ReviewCard from '../ReviewCard';
import { extractAvatarUrl } from '@/hooks/admin/api/types/participationTypes';

interface FeaturedReviewsSectionProps {
  // You can add props here if needed
}

const FeaturedReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedReviews = async () => {
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
              points,
              created_at,
              extended_data
            )
          `)
          .eq('status', 'PUBLISHED')
          .order('likes_count', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        
        // Transform the data to match Review type
        const transformedReviews: Review[] = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          content: item.content,
          images: item.images || [],
          createdAt: new Date(item.created_at),
          viewsCount: item.views_count,
          likesCount: item.likes_count,
          user: item.profiles ? {
            id: item.profiles.id,
            username: item.profiles.username || 'Anonymous',
            email: '',
            points: item.profiles.points || 0,
            createdAt: new Date(item.profiles.created_at),
            avatar: extractAvatarUrl(item.profiles.extended_data)
          } : undefined
        }));
        
        setReviews(transformedReviews);
      } catch (error) {
        console.error('Error fetching featured reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedReviews();
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Featured Reviews</h2>
        {loading ? (
          <p>Loading featured reviews...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedReviewsSection;
