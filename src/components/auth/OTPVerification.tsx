
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
}

const OTPVerification = ({ phoneNumber, onVerify, onResend, onCancel }: OTPVerificationProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus first input when component mounts
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
    
    // Start the countdown timer
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

  const verifyOTP = async () => {
    try {
      const otpValue = otpValues.join('');
      
      if (otpValue.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }
      
      setIsVerifying(true);
      
      await onVerify(otpValue);
      // Navigation to dashboard is now handled by the parent component
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      
      await onResend();
      
      // Reset timer
      setTimer(45);
      
      // Start timer again
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
      
    } catch (error: any) {
      setResendDisabled(false);
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    
    if (value.length > 1) {
      const digits = value.split('').filter(v => /^\d$/.test(v)).slice(0, 6);
      const newFullOtp = [...digits, ...Array(6 - digits.length).fill('')];
      setOtpValues(newFullOtp);
      const focusIndex = Math.min(digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digits = pastedData.split('').filter(char => /^\d$/.test(char)).slice(0, 6);
    
    if (digits.length > 0) {
      const newOtp = [...digits, ...Array(6 - digits.length).fill('')];
      setOtpValues(newOtp);
      const focusIndex = Math.min(digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <FormLabel>Enter verification code</FormLabel>
        <div className="mt-1 text-xs text-gray-500">
          Enter the 6-digit code sent to your phone
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              className="w-12 h-12 text-center text-lg font-semibold"
              value={otpValues[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isVerifying}
            />
          ))}
        </div>
        
        {otpValues.join('').length < 6 && (
          <div className="mt-2 text-center text-sm text-gray-500">
            {6 - otpValues.filter(Boolean).length} digits remaining
          </div>
        )}
        
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500 mb-2">
            {resendDisabled 
              ? `Resend code in ${timer} seconds` 
              : "Didn't receive the code?"}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-brand-teal hover:text-brand-darkTeal"
          >
            Resend Code
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={verifyOTP} 
        className="w-full" 
        disabled={otpValues.filter(Boolean).length !== 6 || isVerifying}
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Verifying...
          </>
        ) : 'Verify OTP'}
      </Button>

      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
