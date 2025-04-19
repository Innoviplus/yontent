
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const phoneSignUpSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
});

export type PhoneSignUpFormValues = z.infer<typeof phoneSignUpSchema>;

export const usePhoneSignUpForm = () => {
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUpWithPhone, verifyPhoneOtp } = useAuth();

  const form = useForm<PhoneSignUpFormValues>({
    resolver: zodResolver(phoneSignUpSchema),
    defaultValues: {
      phone: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const handleSignUp = async (values: PhoneSignUpFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Signing up with phone:", values.phone, "email:", values.email);
      
      const { error, phoneNumber: returnedPhone } = await signUpWithPhone(
        values.phone,
        values.username,
        values.email,
        values.password
      );
      
      if (error) {
        toast.error(error.message || "An error occurred during sign up");
        setIsSubmitting(false);
        return;
      }
      
      setPhoneNumber(returnedPhone || values.phone);
      setShowOTP(true);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      console.log("Verifying OTP:", otp, "for phone:", phoneNumber);
      const { error } = await verifyPhoneOtp(phoneNumber, otp);
      
      if (error) {
        toast.error(error.message || "Failed to verify OTP");
        return;
      }
      
      toast.success("Phone number verified successfully");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  return {
    form,
    showOTP,
    phoneNumber,
    showPassword,
    isSubmitting,
    setShowPassword,
    handleSignUp,
    handleVerifyOtp,
    setShowOTP,
  };
};
