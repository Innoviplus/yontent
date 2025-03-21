import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { toast } from 'sonner';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user: authUser, signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [draftReviews, setDraftReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      return navigate('/login');
    }

    fetchUserProfile();
    fetchUserReviews();
    fetchDraftReviews();
  }, [authUser, navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          (SELECT count(*) FROM reviews WHERE user_id = profiles.id) as completed_reviews,
          (SELECT count(*) FROM user_missions WHERE user_id = profiles.id) as completed_missions
        `)
        .eq('id', authUser?.id)
        .single();

      if (error) {
        throw error;
      }

      setUser(profile);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', authUser?.id)
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUserReviews(reviews || []);
    } catch (error: any) {
      console.error('Error fetching user reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const fetchDraftReviews = async () => {
    try {
      const { data: drafts, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', authUser?.id)
        .eq('status', 'DRAFT')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDraftReviews(drafts || []);
    } catch (error: any) {
      console.error('Error fetching draft reviews:', error);
      toast.error('Failed to load draft reviews.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-10 w-32 mt-4" />
        <Skeleton className="h-60 w-full rounded-xl mt-6" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <div className="bg-white rounded-xl p-8 text-center shadow-card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Could not load profile</h3>
          <p className="text-gray-600 mb-6">
            There was an error loading your profile. Please try again later.
          </p>
          <button onClick={() => signOut()} className="btn-primary">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <UserProfileHeader user={user} />

        {/* Only updating the DashboardTabs component to pass draftReviews prop */}
        <DashboardTabs reviews={userReviews} draftReviews={draftReviews} />
      </div>
    </div>
  );
};

export default Dashboard;
