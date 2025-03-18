
import Navbar from '@/components/Navbar';
import UserProfileHeader from '@/components/dashboard/UserProfileHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { sampleUserData, sampleReviews, sampleMissions } from '@/data/sampleData';

const Dashboard = () => {
  const user = sampleUserData;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* User profile header */}
          <UserProfileHeader user={user} />
          
          {/* Quick actions */}
          <QuickActions />
          
          {/* Tabs for Reviews and Missions */}
          <DashboardTabs reviews={sampleReviews} missions={sampleMissions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
