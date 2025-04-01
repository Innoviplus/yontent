
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Star, Check, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  const isLoading = form.formState.isSubmitting;
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

  const onSubmit = async (values: RegisterFormValues) => {
    // Clear any previous errors
    setFormError(null);
    form.clearErrors();
    
    const { error } = await signUp(values.email, values.password, values.username);
    
    if (error) {
      if (error.message && (
          error.message.includes('duplicate key') || 
          error.message.includes('profiles_username_key') ||
          error.message.includes('Database error saving new user')
        )) {
        setFormError('This username is already taken. Please choose a different one.');
        form.setError('username', { 
          type: 'manual', 
          message: '' // Let's not duplicate the error message
        });
      } else if (error.message && error.message.includes('Email already registered')) {
        setFormError('This email is already registered. Please use a different email or login.');
        form.setError('email', {
          type: 'manual',
          message: ''
        });
      } else {
        setFormError(error.message);
      }
      return;
    }
    
    // If successful, navigate to settings page instead of dashboard
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-brand-teal/10 flex items-center justify-center rounded-full mb-4">
                <Star className="h-6 w-6 text-brand-teal" />
              </div>
              <h1 className="heading-3 mb-2">Create Your Account</h1>
              <p className="text-gray-600 text-sm">
                Join Review Rewards to start earning points
              </p>
            </div>
            
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
                        <Input 
                          placeholder="Choose a username"
                          autoComplete="username"
                          {...field} 
                        />
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
                      
                      {/* Password strength indicator */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center
                              ${passwordValidation.minLength ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
                          >
                            {passwordValidation.minLength && <Check className="h-3 w-3" />}
                          </div>
                          <span className={passwordValidation.minLength ? 'text-brand-teal' : 'text-gray-500'}>
                            At least 8 characters
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center
                              ${passwordValidation.hasNumber ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
                          >
                            {passwordValidation.hasNumber && <Check className="h-3 w-3" />}
                          </div>
                          <span className={passwordValidation.hasNumber ? 'text-brand-teal' : 'text-gray-500'}>
                            At least 1 number
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center
                              ${passwordValidation.hasSpecial ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
                          >
                            {passwordValidation.hasSpecial && <Check className="h-3 w-3" />}
                          </div>
                          <span className={passwordValidation.hasSpecial ? 'text-brand-teal' : 'text-gray-500'}>
                            At least 1 special character
                          </span>
                        </div>
                      </div>
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
                          <Link to="/terms" className="text-brand-teal hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link to="/privacy" className="text-brand-teal hover:underline">Privacy Policy</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex justify-center items-center"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </Form>
            
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-brand-slate" />
              <span>Your data is securely encrypted and never shared.</span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-brand-teal hover:text-brand-darkTeal transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
