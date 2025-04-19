
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface OTPResendButtonProps {
  onResend: () => Promise<void>;
  initialTimer?: number;
}

const OTPResendButton = ({ onResend, initialTimer = 45 }: OTPResendButtonProps) => {
  const [timer, setTimer] = useState(initialTimer);
  const [resendDisabled, setResendDisabled] = useState(true);

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
        onClick={onResend}
        disabled={resendDisabled}
        className="text-brand-teal hover:text-brand-darkTeal"
      >
        Resend Code
      </Button>
    </div>
  );
};

export default OTPResendButton;
