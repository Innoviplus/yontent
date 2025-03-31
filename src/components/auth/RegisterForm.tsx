
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PhoneInput } from '@/components/settings/PhoneInput';
import { toast } from 'sonner';
import { registerSchema, RegisterFormValues } from './schemas/registerSchema';
import { PasswordField } from './PasswordField';
import { TermsCheckbox } from './TermsCheckbox';
import { SubmitButton } from './SubmitButton';

const RegisterForm = () => {
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      phoneNumber: '',
      phoneCountryCode: '+1',
      acceptTerms: false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: RegisterFormValues) => {
    // Clear any previous username error
    setUsernameError(null);
    
    const phoneWithCountryCode = `${values.phoneCountryCode}${values.phoneNumber}`;
    
    try {
      console.log('Starting signup process');
      const { success, error } = await signUp(
        values.username,
        values.password, 
        phoneWithCountryCode
      );
      
      if (error) {
        // Check if error message contains information about duplicate username
        if (error.message && error.message.includes('username is already taken')) {
          setUsernameError(error.message);
          form.setError('username', { 
            type: 'manual', 
            message: error.message
          });
        }
        throw error;
      }
      
      if (success) {
        // Log successful registration before navigation
        console.log('Registration successful, redirecting to settings page');
        toast.success('Account created successfully! You received 10 welcome points.');
        
        // Navigate to settings page instead of homepage
        navigate('/settings', { replace: true });
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
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
              {usernameError && (
                <p className="text-sm font-medium text-destructive">{usernameError}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  countryCode={form.watch('phoneCountryCode')}
                  onCountryCodeChange={(code) => form.setValue('phoneCountryCode', code)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <PasswordField form={form} />
        
        <TermsCheckbox form={form} />
        
        <SubmitButton isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default RegisterForm;
