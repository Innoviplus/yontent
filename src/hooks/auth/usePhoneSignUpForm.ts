
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
  const [formData, setFormData] = useState<PhoneSignUpFormValues | null>(null);
  const { signUpWithPhone, verifyPhoneOtp, resendOtp } = useAuth();

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
      console.log("Initiating signup process for:", values.phone);
      
      // Store form data for use after OTP verification
      setFormData(values);
      setPhoneNumber(values.phone);
      
      // Only send OTP at this stage, don't create Supabase record yet
      const { error } = await signUpWithPhone(
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
      
      setShowOTP(true);
      setIsSubmitting(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      if (!formData) {
        toast.error("Missing registration data");
        return;
      }

      console.log("Verifying OTP and creating user record:", otp);
      
      // Pass the complete form data to verifyPhoneOtp so it can create the proper user record
      const { error } = await verifyPhoneOtp(phoneNumber, otp);
      
      if (error) {
        toast.error(error.message || "Failed to verify OTP");
        return;
      }
      
      toast.success("Phone number verified and account created successfully");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log("Resending OTP to:", phoneNumber);
      
      if (!phoneNumber) {
        toast.error("Phone number is missing");
        return;
      }
      
      const { error } = await resendOtp(phoneNumber);
      
      if (error) {
        toast.error(error.message || "Failed to resend verification code");
        return;
      }
      
      toast.success("New verification code sent");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification code");
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
    handleResendOtp,
    setShowOTP,
  };
};
