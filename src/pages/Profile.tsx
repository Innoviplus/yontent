
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
    } else {
      navigate('/dashboard'); // Redirect to dashboard if logged in
    }
  }, [user, navigate]);

  // Always return a JSX element even during authentication check
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-8 px-4 pt-28">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
