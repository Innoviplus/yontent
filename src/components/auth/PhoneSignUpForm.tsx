
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';

const phoneSignUpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
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

  const form = useForm<PhoneSignUpFormValues>({
    resolver: zodResolver(phoneSignUpSchema),
    defaultValues: {
      phone: '',
      username: '',
    },
  });

  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleSignUp = async (values: PhoneSignUpFormValues) => {
    try {
      const formattedPhone = values.phone.startsWith('+') ? values.phone : `+${values.phone}`;
      const { error } = await signUpWithPhone(formattedPhone, values.username);
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setPhoneNumber(formattedPhone);
      setShowOTP(true);
      toast.success('OTP sent to your phone number');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
    }
  };

  const verifyOTP = async (values: { otp: string }) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: values.otp,
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

  if (showOTP) {
    return (
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-6">
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter verification code</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center space-y-2">
                    <InputOTP 
                      maxLength={6}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    <div className="text-xs text-gray-500 mt-1">
                      Enter the 6-digit code sent to your phone
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={otpForm.formState.isSubmitting}>
            {otpForm.formState.isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
      </Form>
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+1234567890" type="tel" />
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
