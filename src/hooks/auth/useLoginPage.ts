
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { EmailLoginFormValues, PhoneLoginFormValues } from '@/components/auth/login/LoginFormSchemas';

export const useLoginPage = () => {
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { signInWithPhone, verifyPhoneOtp: authVerifyPhoneOtp, resendOtp: authResendOtp, signIn } = useAuth();

  const handleVerifyOtp = async (otp: string) => {
    try {
      console.log("Verifying OTP for phone number:", phoneNumber);
      const { error } = await authVerifyPhoneOtp(phoneNumber, otp);
      
      if (error) {
        toast.error("Verification Failed", {
          description: error.message || "Invalid verification code"
        });
        return;
      }
      
      // Redirect to dashboard after successful verification
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error("Verification Failed", {
        description: error.message || "Failed to verify code"
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const { error } = await authResendOtp(phoneNumber);
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

  const handleCancelOtp = () => {
    setShowOtpVerification(false);
  };

  const handlePhoneSubmit = async (values: PhoneLoginFormValues) => {
    try {
      const { phone, password } = values;
      setPhoneNumber(phone);
      
      const result = await signInWithPhone(phone, password);
      
      if (result.error) {
        toast.error("Login Failed", {
          description: result.error.message || "Invalid phone number or password"
        });
        return;
      }
      
      // Phone login no longer requires OTP, it should have a session now
      if (result.session) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Phone login error:", error);
      toast.error("Login Failed", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  const handleEmailSubmit = async (values: EmailLoginFormValues) => {
    try {
      const { email, password } = values;
      
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error("Login Failed", {
          description: error.message || "Invalid email or password"
        });
        return;
      }
      
      // Auth context will handle redirection after successful login
    } catch (error: any) {
      console.error("Email login error:", error);
      toast.error("Login Failed", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  return {
    showOtpVerification,
    setShowOtpVerification,
    phoneNumber,
    setPhoneNumber,
    handleVerifyOtp,
    handleResendOtp,
    handleCancelOtp,
    handlePhoneSubmit,
    handleEmailSubmit
  };
};
