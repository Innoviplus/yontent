
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import PasswordVisibilityToggle from './PasswordVisibilityToggle';
import TermsCheckbox from './TermsCheckbox';
import FormFooter from './FormFooter';
import SubmitButton from './SubmitButton';
import { registerSchema, RegisterFormValues, validatePassword } from './RegisterFormSchema';

const RegisterForm = () => {
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
    
    // If successful, navigate to settings page
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
                    <PasswordVisibilityToggle
                      showPassword={showPassword}
                      toggleVisibility={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                
                <PasswordStrengthIndicator passwordValidation={passwordValidation} />
              </FormItem>
            )}
          />
          
          <TermsCheckbox form={form} />
          
          <SubmitButton isLoading={isLoading} label="Create Account" />
        </form>
      </Form>
      
      <FormFooter />
    </>
  );
};

export default RegisterForm;
