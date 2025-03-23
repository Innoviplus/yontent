
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReviewContextType {
  reviews: any[];
  isLoading: boolean;
  fetchReviews: (options?: { limit?: number; offset?: number }) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReviews = async (options = { limit: 10, offset: 0 }) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(options.offset, options.offset + options.limit - 1);
        
      if (error) throw error;
      
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, isLoading, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
