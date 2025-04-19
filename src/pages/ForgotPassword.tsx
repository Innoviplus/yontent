
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import { usePasswordReset } from '@/hooks/auth/usePasswordReset';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { handleResetPassword, isResetting } = usePasswordReset();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await handleResetPassword(values.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-md">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <Link to="/login" className="inline-flex items-center text-brand-teal mb-6 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            
            <div className="text-center mb-8">
              <h1 className="heading-3 mb-2">Forgot Password</h1>
              <p className="text-gray-600 text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </div>
            
            {emailSent ? (
              <div className="text-center">
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                  <p className="font-medium">Reset link sent!</p>
                  <p className="text-sm mt-1">
                    Check your inbox for instructions to reset your password.
                  </p>
                </div>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="yourname@example.com" 
                            type="email"
                            autoComplete="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="submit"
                    disabled={isResetting}
                    className="w-full bg-brand-teal hover:bg-brand-darkTeal"
                  >
                    {isResetting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
