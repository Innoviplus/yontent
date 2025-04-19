
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';

interface OTPVerificationProps {
  phoneNumber: string;
}

const OTPVerification = ({ phoneNumber }: OTPVerificationProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Focus first input when component mounts
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const verifyOTP = async () => {
    try {
      const otpValue = otpValues.join('');
      
      if (otpValue.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpValue,
        type: 'sms',
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Phone number verified successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
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
            />
          ))}
        </div>
        
        {otpValues.join('').length < 6 && (
          <div className="mt-2 text-center text-sm text-gray-500">
            {6 - otpValues.filter(Boolean).length} digits remaining
          </div>
        )}
      </div>
      
      <Button 
        onClick={verifyOTP} 
        className="w-full" 
        disabled={otpValues.filter(Boolean).length !== 6}
      >
        Verify OTP
      </Button>
    </div>
  );
};

export default OTPVerification;
