
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check for error parameters in the URL
  useEffect(() => {
    // Parse the URL hash for error information
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    if (error === 'access_denied' && errorDescription) {
      setIsTokenValid(false);
      setTokenError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      setShowExpiredDialog(true);
    } else {
      // Check if there's a valid token
      const checkToken = async () => {
        try {
          // This just checks if the user was redirected with a valid recovery token
          // The actual token is handled by Supabase client automatically
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Token validation error:", error);
            setIsTokenValid(false);
            setTokenError("Password reset link is invalid or has expired");
            setShowExpiredDialog(true);
          } else if (data.session) {
            setIsTokenValid(true);
          } else {
            // No active session and no error means we need to wait for the hash to be processed
            // This is normal and not an error state
            setIsTokenValid(null);
          }
        } catch (error) {
          console.error("Token validation error:", error);
          setIsTokenValid(false);
        }
      };
      
      checkToken();
    }
  }, [location.hash]);

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      setIsResetting(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) {
        toast.error(error.message || "Failed to reset password");
        return;
      }
      
      toast.success("Password reset successfully");
      
      // Clear form and navigate to login
      form.reset();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "An error occurred during password reset");
    } finally {
      setIsResetting(false);
    }
  };

  const handleRequestNewLink = async () => {
    navigate('/forgot-password');
  };

  if (isTokenValid === null) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
        <p className="ml-2">Validating your reset link...</p>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset link expired</DialogTitle>
            <DialogDescription>
              {tokenError || "Your password reset link has expired or is invalid"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p>Please request a new password reset link to continue.</p>
            <Button onClick={handleRequestNewLink} className="bg-brand-teal hover:bg-brand-darkTeal">
              Request new link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {isTokenValid ? (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="heading-4 mb-2">Reset your password</h2>
            <p className="text-sm text-gray-600">Enter your new password below</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-brand-teal hover:bg-brand-darkTeal"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : "Reset Password"}
              </Button>
            </form>
          </Form>
        </div>
      ) : null}
    </>
  );
};

export default ResetPasswordForm;
