
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLoginPage = () => {
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = async (otp: string) => {
    try {
      console.log("Verifying OTP for phone number:", phoneNumber);
      const { error } = await verifyPhoneOtp(phoneNumber, otp);
      
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

  const handleCancelOtp = () => {
    setShowOtpVerification(false);
  };

  return {
    showOtpVerification,
    setShowOtpVerification,
    phoneNumber,
    setPhoneNumber,
    handleVerifyOtp,
    handleResendOtp,
    handleCancelOtp
  };
};
