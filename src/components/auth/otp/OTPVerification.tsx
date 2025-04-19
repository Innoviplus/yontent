
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import OTPInputField from './OTPInputField';
import OTPResendButton from './OTPResendButton';
import OTPHeader from './OTPHeader';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
}

const OTPVerification = ({ 
  phoneNumber, 
  onVerify, 
  onResend,
  onCancel 
}: OTPVerificationProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
  const navigate = useNavigate();

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    
    // Handle paste event with multiple digits
    if (value.length > 1) {
      const digits = value.split('').filter(v => /^\d$/.test(v)).slice(0, 6);
      const newFullOtp = [...digits, ...Array(6 - digits.length).fill('')];
      setOtpValues(newFullOtp);
      
      // Focus on the appropriate field after paste
      if (digits.length < 6) {
        setTimeout(() => {
          inputRefs.current[digits.length]?.focus();
        }, 0);
      }
      return;
    }

    // Handle single digit input
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Auto-focus next input field if a value was entered
    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
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
      
      // Focus on the appropriate field after paste
      if (digits.length < 6) {
        setTimeout(() => {
          inputRefs.current[digits.length]?.focus();
        }, 0);
      }
    }
  };

  const verifyOTP = async () => {
    try {
      setIsVerifying(true);
      await onVerify(otpValues.join(''));
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      await onResend();
      // Clear the current OTP values after resending
      setOtpValues(Array(6).fill(''));
      // Focus on the first input after resend
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormLabel>Enter verification code</FormLabel>
      <OTPHeader phoneNumber={phoneNumber} />
      
      <div className="flex justify-center gap-2 mt-4">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <OTPInputField
            key={index}
            index={index}
            value={otpValues[index]}
            isVerifying={isVerifying}
            onChange={handleOtpChange}
            onKeyDown={handleKeyDown}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => inputRefs.current[index] = el}
          />
        ))}
      </div>
      
      {otpValues.join('').length < 6 && (
        <div className="mt-2 text-center text-sm text-gray-500">
          {6 - otpValues.filter(Boolean).length} digits remaining
        </div>
      )}
      
      <OTPResendButton onResend={handleResendOTP} />
      
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
