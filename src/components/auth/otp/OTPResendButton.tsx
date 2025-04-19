
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OTPResendButtonProps {
  onResend: () => Promise<void>;
  initialTimer?: number;
}

const OTPResendButton = ({ onResend, initialTimer = 45 }: OTPResendButtonProps) => {
  const [timer, setTimer] = useState(initialTimer);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, []);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResend();
      // Reset timer and disable button after successful resend
      setTimer(initialTimer);
      setResendDisabled(true);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <div className="text-sm text-gray-500 mb-2">
        {resendDisabled 
          ? `Resend code in ${timer} seconds` 
          : "Didn't receive the code?"}
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleResend}
        disabled={resendDisabled || isResending}
        className="text-brand-teal hover:text-brand-darkTeal"
      >
        {isResending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Sending...
          </>
        ) : 'Resend Code'}
      </Button>
    </div>
  );
};

export default OTPResendButton;
