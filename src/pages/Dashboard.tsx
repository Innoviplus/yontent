
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { userReviews, draftReviews } = useDashboardReviews(authUser?.id);

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <DashboardError />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <UserProfileHeader user={user} />
        <DashboardTabs reviews={userReviews} draftReviews={draftReviews} />
      </div>
    </div>
  );
};

export default Dashboard;
