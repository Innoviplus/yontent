
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import DashboardError from '@/components/dashboard/DashboardError';
import { useDashboardProfile } from '@/hooks/useDashboardProfile';
import { useDashboardReviews } from '@/hooks/useDashboardReviews';

const Dashboard = () => {
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
        <DashboardTabs reviews={userReviews} draftReviews={draftReviews} />
      </div>
    </div>
  );
};

export default Dashboard;
