
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';

// Cache for review data
const reviewsCache = new Map<string, { data: Review[], timestamp: number }>();
const CACHE_EXPIRY = 30 * 1000; // 30 seconds cache expiry for more frequent updates when testing

export const fetchReviews = async (sortBy: string, userId?: string): Promise<Review[]> => {
  try {
    const cacheKey = `${sortBy}-${userId || 'no-user'}`;
    
    // Clear cache to get fresh data
    reviewsCache.delete(cacheKey);
    
    console.log('Fetching fresh reviews data with sort:', sortBy);
    
    // Limit the amount of data we're retrieving
    const FETCH_LIMIT = 50;
    
    let query = supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        content,
        images,
        videos,
        views_count,
        likes_count,
        created_at,
        profiles:user_id (
          id,
          username,
          avatar
        )
      `)
      .eq('status', 'PUBLISHED')
      .limit(FETCH_LIMIT);

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('views_count', { ascending: false });
    } else if (sortBy === 'trending') {
      query = query.order('likes_count', { ascending: false });
    } else if (sortBy === 'relevant' && userId) {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('likes_count', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to load reviews');
    }
    
    if (data) {
      const transformedReviews: Review[] = data.map(review => {
        // Log the likes_count for debugging
        console.log(`Review ${review.id} has likes_count:`, review.likes_count);
        
        return {
          id: review.id,
          userId: review.user_id,
          productName: "Review",
          rating: 5,
          content: review.content,
          images: review.images || [],
          videos: review.videos || [],
          viewsCount: review.views_count || 0,
          likesCount: review.likes_count || 0,
          createdAt: new Date(review.created_at),
          user: review.profiles ? {
            id: review.profiles.id || review.user_id,
            username: review.profiles.username || 'Anonymous',
            email: '',
            points: 0,
            createdAt: new Date(),
            avatar: review.profiles.avatar
          } : undefined
        };
      });
      
      // Cache the results
      reviewsCache.set(cacheKey, { 
        data: transformedReviews, 
        timestamp: Date.now() 
      });
      
      return transformedReviews;
    }
    
    return [];
  } catch (error) {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};

// Function to clear the cache after a review is submitted or liked/unliked
export const clearReviewsCache = () => {
  reviewsCache.clear();
};
