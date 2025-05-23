
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import MissionsTab from '@/components/dashboard/MissionsTab';
import { useNavigate } from 'react-router-dom';
import RewardHeader from '@/components/rewards/RewardHeader';

const MyMissions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <RewardHeader title="Back to My Dashboard" />
        
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Missions</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <p className="text-gray-600 mb-6">
            Track the status of your mission participations and submissions below.
          </p>
          
          <MissionsTab />
        </div>
      </div>
    </div>
  );
};

export default MyMissions;
