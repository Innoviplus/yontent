
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import Navbar from '@/components/Navbar';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OTPVerification from '@/components/auth/OTPVerification';
import EmailLoginForm, { EmailLoginFormValues, emailLoginSchema } from '@/components/auth/login/EmailLoginForm';
import PhoneLoginForm, { PhoneLoginFormValues, phoneLoginSchema } from '@/components/auth/login/PhoneLoginForm';

const Login = () => {
  const [userCountry, setUserCountry] = useState('HK');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [storedPassword, setStoredPassword] = useState('');
  
  const { signIn, signInWithPhone, verifyPhoneOtp, resendOtp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema)
  });

  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema)
  });

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_code || 'HK');
      } catch (error) {
        console.error('Failed to detect country', error);
      }
    };

    detectCountry();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const onEmailSubmit = async (values: EmailLoginFormValues) => {
    try {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        toast.error("Login Failed", {
          description: error.message
        });
        return;
      }
      toast.success("Login successful!");
      console.log("Login successful, redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };

  const onPhoneSubmit = async (values: PhoneLoginFormValues) => {
    try {
      console.log("Submitting phone login with:", values.phone);
      setPhoneNumber(values.phone);
      setStoredPassword(values.password);

      const { error } = await signInWithPhone(values.phone, values.password);
      if (error) {
        toast.error("Login Failed", {
          description: error.message || "Invalid phone number or password"
        });
        return;
      }
      
      setShowOtpVerification(true);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login Failed", {
        description: error.message || "An error occurred during login"
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const { error } = await verifyPhoneOtp(phoneNumber, otp);
      if (error) {
        toast.error("Verification Failed", {
          description: error.message || "Invalid verification code"
        });
        return;
      }
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Verification Failed", {
        description: error.message || "Failed to verify code"
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const { error } = await resendOtp(phoneNumber);
      if (error) {
        toast.error("Failed to resend code", {
          description: error.message
        });
        return;
      }
      toast.success("Verification code resent");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend code");
    }
  };

  if (showOtpVerification) {
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
                <h1 className="heading-3 mb-2">Verify Your Phone</h1>
                <p className="text-gray-600 text-sm">
                  Enter the verification code sent to {phoneNumber}
                </p>
              </div>

              <OTPVerification
                phoneNumber={phoneNumber}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onCancel={() => setShowOtpVerification(false)}
              />

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowOtpVerification(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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

            <Tabs
              defaultValue="email"
              className="w-full"
              onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <EmailLoginForm
                  form={emailForm}
                  onSubmit={onEmailSubmit}
                  isLoading={emailForm.formState.isSubmitting}
                />
              </TabsContent>

              <TabsContent value="phone">
                <PhoneLoginForm
                  form={phoneForm}
                  onSubmit={onPhoneSubmit}
                  isLoading={phoneForm.formState.isSubmitting}
                  userCountry={userCountry}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-brand-teal hover:text-brand-darkTeal transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
