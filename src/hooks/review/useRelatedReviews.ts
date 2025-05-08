
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRelatedReviews = (review: Review | null) => {
  const [relatedReviews, setRelatedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchRelatedReviews = async (reviewData: Review) => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            user_id,
            content,
            images,
            videos,
            views_count,
            created_at,
            profiles:user_id (
              id,
              username,
              avatar,
              points,
              created_at
            )
          `)
          .neq('id', reviewData.id)
          .eq('status', 'PUBLISHED') // Only fetch published reviews
          .order('views_count', { ascending: false })
          .limit(5); // Limit to just 5 reviews for faster loading
        
        if (error) {
          console.error('Error fetching related reviews:', error);
          if (isMounted) {
            toast.error('Failed to load related reviews');
          }
          throw error;
        }
        
        if (!data || !isMounted) {
          return;
        }
        
        const transformedReviews: Review[] = data.map(item => {
          const profile = item.profiles as any; // Cast to any to safely access properties
          
          return {
            id: item.id,
            userId: item.user_id,
            productName: "Review",
            rating: 5,
            content: item.content,
            images: item.images || [],
            videos: item.videos || [],
            viewsCount: item.views_count,
            createdAt: new Date(item.created_at),
            user: profile ? {
              id: profile.id || item.user_id,
              username: profile.username || 'Anonymous',
              email: '',
              points: profile.points || 0,
              createdAt: profile.created_at ? new Date(profile.created_at) : new Date(item.created_at),
              avatar: profile.avatar
            } : undefined
          };
        });
        
        if (isMounted) {
          setRelatedReviews(transformedReviews);
        }
      } catch (error) {
        console.error('Error fetching related reviews:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (review) {
      fetchRelatedReviews(review);
    }
    
    return () => {
      isMounted = false;
    };
  }, [review?.id]); // Only re-fetch when review ID changes
  
  return { relatedReviews, loading };
};
