
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { toast } from 'sonner';

export const useDashboardReviews = (userId: string | undefined) => {
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [draftReviews, setDraftReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        // Fetch published reviews
        const { data: reviews, error: publishedError } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'PUBLISHED')
          .order('created_at', { ascending: false });

        if (publishedError) {
          throw publishedError;
        }

        // Transform the data to match the Review type
        const transformedReviews: Review[] = (reviews || []).map(review => ({
          id: review.id,
          userId: review.user_id,
          content: review.content,
          images: review.images || [],
          videos: review.videos || [],
          createdAt: new Date(review.created_at),
          viewsCount: review.views_count,
          likesCount: review.likes_count,
          status: review.status
        }));

        setUserReviews(transformedReviews);

        // Fetch draft reviews
        const { data: drafts, error: draftsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'DRAFT')
          .order('created_at', { ascending: false });

        if (draftsError) {
          throw draftsError;
        }

        // Transform the data to match the Review type
        const transformedDrafts: Review[] = (drafts || []).map(draft => ({
          id: draft.id,
          userId: draft.user_id,
          content: draft.content,
          images: draft.images || [],
          videos: draft.videos || [],
          createdAt: new Date(draft.created_at),
          viewsCount: draft.views_count,
          likesCount: draft.likes_count,
          status: draft.status
        }));

        setDraftReviews(transformedDrafts);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [userId]);

  return { userReviews, draftReviews, isLoading };
};
