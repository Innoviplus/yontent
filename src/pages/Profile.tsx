
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Return loading state or null while checking authentication
  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8 px-4 pt-28">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <p className="text-gray-500">
          This page is under construction. Profile functionality will be available soon.
        </p>
      </div>
    </div>
  );
};

export default Profile;
