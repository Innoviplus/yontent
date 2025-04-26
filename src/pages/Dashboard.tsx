
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import UserOwnStatsCard from '@/components/user-profile/UserOwnStatsCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import DashboardError from '@/components/dashboard/DashboardError';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useDashboardReviews } from '@/hooks/useDashboardReviews';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { usePageTitle } from '@/hooks/usePageTitle';

const Dashboard = () => {
  usePageTitle('Dashboard');
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { user, loading } = useDashboardProfile(authUser?.id);
  const { userReviews, draftReviews, isLoading } = useDashboardReviews(authUser?.id);

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  if (loading || isLoading) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <DashboardError />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <UserProfileHeader user={user} />
        <UserOwnStatsCard 
          user={user}
          reviewsCount={userReviews.length}
          followersCount={user.followersCount || 0}
          followingCount={user.followingCount || 0}
          pointsCount={user.points || 0}
          transactionsCount={user.transactionsCount || 0}
        />
        <div className="mt-8">
          <DashboardTabs reviews={userReviews} draftReviews={draftReviews} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
