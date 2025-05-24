
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';

// Cache for review data
const reviewsCache = new Map<string, { data: Review[], timestamp: number }>();
const CACHE_EXPIRY = 2 * 1000; // 2 seconds cache expiry for more frequent updates

export const fetchReviews = async (sortBy: string, userId?: string): Promise<Review[]> => {
  try {
    const cacheKey = `${sortBy}-${userId || 'no-user'}`;
    const now = Date.now();
    const cachedData = reviewsCache.get(cacheKey);
    
    // Use cached data if it exists and hasn't expired
    if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
      console.log('Using cached reviews data');
      return cachedData.data;
    }
    
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
      const transformedReviews: Review[] = await Promise.all(data.map(async review => {
        // Verify likes_count directly from the review_likes table to ensure accurate count
        let likesCount = review.likes_count;
        
        if (likesCount === null || likesCount === undefined || true) { // Always fetch to ensure accuracy
          console.log(`Fetching actual likes count for review ${review.id}`);
          
          const { count, error: countError } = await supabase
            .from('review_likes')
            .select('*', { count: 'exact', head: false })
            .eq('review_id', review.id);
            
          if (!countError && count !== null) {
            likesCount = count;
            console.log(`Actual likes count for review ${review.id} is ${count}`);
            
            // Update the database if the count doesn't match
            if (review.likes_count !== count) {
              console.log(`Updating likes count in database for review ${review.id} from ${review.likes_count} to ${count}`);
              await supabase
                .from('reviews')
                .update({ likes_count: count })
                .eq('id', review.id);
            }
          }
        }
        
        return {
          id: review.id,
          userId: review.user_id,
          productName: "Review",
          rating: 5,
          content: review.content,
          images: review.images || [],
          videos: review.videos || [],
          viewsCount: review.views_count || 0,
          likesCount: likesCount || 0,
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
      }));
      
      // Cache the transformed data
      reviewsCache.set(cacheKey, {
        data: transformedReviews,
        timestamp: now
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
  console.log('Reviews cache cleared');
};
