// Move the existing form logic from RegisterForm.tsx to this new component
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const emailSignUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
});

type EmailSignUpFormValues = z.infer<typeof emailSignUpSchema>;

const EmailSignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<EmailSignUpFormValues>({
    resolver: zodResolver(emailSignUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      acceptTerms: false
    }
  });

  const passwordValue = form.watch('password');
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      minLength,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasNumber && hasSpecial
    };
  };

  const passwordValidation = validatePassword(passwordValue || '');

  const onSubmit = async (values: EmailSignUpFormValues) => {
    setFormError(null);
    form.clearErrors();
    const { error } = await signUp(values.email, values.password, values.username);
    
    if (error) {
      if (error.message.includes('duplicate key') || error.message.includes('profiles_username_key')) {
        setFormError('This username is already taken. Please choose a different one.');
      } else if (error.message.includes('Email already registered')) {
        setFormError('This email is already registered. Please use a different email or login.');
      } else {
        setFormError(error.message);
      }
      return;
    }

    navigate('/settings');
  };

  return (
    <>
      {formError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
          {formError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Choose a username" autoComplete="username" {...field} />
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
                  <Input placeholder="yourname@example.com" type="email" autoComplete="email" {...field} />
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
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
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
                <PasswordStrengthIndicator passwordValidation={passwordValidation} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex items-start space-y-0 space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mt-0.5 h-4 w-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal focus:ring-offset-0"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to the{' '}
                    <Link to="/terms-of-service" className="text-brand-teal hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" className="text-brand-teal hover:underline">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-brand-teal hover:bg-brand-darkTeal text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2">
            {form.formState.isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EmailSignUpForm;
