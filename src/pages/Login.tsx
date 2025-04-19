
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import LoginOTPVerification from '@/components/auth/login/LoginOTPVerification';
import { useLoginPage } from '@/hooks/auth/useLoginPage';
import LoginFormTabs from '@/components/auth/login/LoginFormTabs';

const Login = () => {
  const { 
    showOtpVerification, 
    phoneNumber, 
    handleVerifyOtp, 
    handleResendOtp, 
    handleCancelOtp 
  } = useLoginPage();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  if (showOtpVerification) {
    return (
      <LoginOTPVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onCancel={handleCancelOtp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-md">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-brand-teal/10 flex items-center justify-center rounded-full mb-4">
                <Star className="h-6 w-6 text-brand-teal" />
              </div>
              <h1 className="heading-3 mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-sm">Sign in to your Yontent account</p>
            </div>
            <LoginFormTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
