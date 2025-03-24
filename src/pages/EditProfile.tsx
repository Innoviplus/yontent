
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Automatically redirect to the settings page
  useEffect(() => {
    if (user) {
      navigate('/settings');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-28 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Settings</h1>
        <p className="text-gray-500 mb-8">
          The profile editing functionality is now available in the Settings page.
        </p>
        <Button onClick={() => navigate('/settings')}>
          Go to Settings
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
