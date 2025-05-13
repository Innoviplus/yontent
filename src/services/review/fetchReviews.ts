
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { syncAllLikesCounts } from '@/lib/api';

// Cache for review data
const reviewsCache = new Map<string, { data: Review[], timestamp: number }>();
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes cache expiry for more frequent updates

export const fetchReviews = async (sortBy: string, userId?: string): Promise<Review[]> => {
  try {
    const cacheKey = `${sortBy}-${userId || 'no-user'}`;
    const cachedResult = reviewsCache.get(cacheKey);
    
    // Return cached data if it exists and hasn't expired
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_EXPIRY) {
      return cachedResult.data;
    }
    
    console.log('Cache miss, fetching fresh reviews data');
    
    // Periodically sync all likes counts (do this in the background)
    syncAllLikesCounts().catch(err => 
      console.error('Background sync of all likes counts failed:', err)
    );
    
    // Limit the amount of data we're retrieving
    const FETCH_LIMIT = 50; // Fetch fewer items for better performance
    
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
      // Trending is a combination of recent and popularity
      query = query.order('likes_count', { ascending: false });
    } else if (sortBy === 'relevant' && userId) {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to load reviews');
    }
    
    if (data) {
      const transformedReviews: Review[] = data.map(review => ({
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
      }));
      
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
