
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import PhoneNumberInput from './PhoneNumberInput';

// Expanded schema to include email
const phoneSignUpSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address')
});

type PhoneSignUpFormValues = z.infer<typeof phoneSignUpSchema>;

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

const PhoneSignUpForm = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const { signUpWithPhone } = useAuth();
  const navigate = useNavigate();
  
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [userCountry, setUserCountry] = useState('HK');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<PhoneSignUpFormValues>({
    resolver: zodResolver(phoneSignUpSchema),
    defaultValues: {
      phone: '',
      username: '',
      email: ''
    },
  });

  // IP-based country code detection
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

  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleSignUp = async (values: PhoneSignUpFormValues) => {
    try {
      const { error } = await signUpWithPhone(
        values.phone,
        values.username,
        values.email
      );
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setPhoneNumber(values.phone);
      setShowOTP(true);
      toast.success('OTP sent to your phone number');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
    }
  };

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
    // Only allow digits
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    const newOtpValues = [...otpValues];
    
    // If pasting a full OTP code
    if (value.length > 1) {
      const digits = value.split('').filter(v => /^\d$/.test(v)).slice(0, 6);
      const newFullOtp = [...digits, ...Array(6 - digits.length).fill('')];
      setOtpValues(newFullOtp);
      
      // Focus last filled input or the next empty one
      const focusIndex = Math.min(digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    // Handle regular single digit input
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Auto-focus next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Handle left/right arrow keys for navigation
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
      
      // Focus the next empty input or the last one
      const focusIndex = Math.min(digits.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  useEffect(() => {
    if (showOTP) {
      // Focus the first input when OTP form is displayed
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [showOTP]);

  if (showOTP) {
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Choose a username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter your email address" 
                  type="email" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneNumberInput
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry={userCountry}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Sending OTP...' : 'Continue'}
        </Button>
      </form>
    </Form>
  );
};

export default PhoneSignUpForm;
