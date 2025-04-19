
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import PhoneNumberInput from './PhoneNumberInput';
import OTPVerification from './OTPVerification';
import { Eye, EyeOff } from 'lucide-react';

const phoneSignUpSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
});

type PhoneSignUpFormValues = z.infer<typeof phoneSignUpSchema>;

const PhoneSignUpForm = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUpWithPhone } = useAuth();
  const [userCountry, setUserCountry] = useState('HK');

  const form = useForm<PhoneSignUpFormValues>({
    resolver: zodResolver(phoneSignUpSchema),
    defaultValues: {
      phone: '',
      username: '',
      email: '',
      password: '',
    },
  });

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

  if (showOTP) {
    return <OTPVerification phoneNumber={phoneNumber} />;
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Continue'}
        </Button>
      </form>
    </Form>
  );
};

export default PhoneSignUpForm;
