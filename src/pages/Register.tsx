
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import RegisterFormHeader from '@/components/auth/RegisterFormHeader';
import RegisterForm from '@/components/auth/RegisterForm';
import RegisterFooter from '@/components/auth/RegisterFooter';

const Register = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to settings if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/settings', { replace: true });
    }
  }, [user, loading, navigate]);

  // If still loading, show nothing to prevent flash
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, show registration form
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <RegisterFormHeader />
            <RegisterForm />
            <RegisterFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
