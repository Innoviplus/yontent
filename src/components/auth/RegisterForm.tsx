
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
  const [phoneError, setPhoneError] = useState<string | null>(null);
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
    // Clear any previous errors
    setUsernameError(null);
    setPhoneError(null);
    
    // Use the country code and phone number separately
    const phoneWithCountryCode = `${values.phoneCountryCode}${values.phoneNumber}`;
    
    try {
      console.log('Starting signup process');
      console.log('Country code:', values.phoneCountryCode);
      console.log('Phone number:', values.phoneNumber);
      console.log('Full phone:', phoneWithCountryCode);
      
      const { success, error } = await signUp(
        values.username,
        values.password, 
        phoneWithCountryCode,
        values.phoneCountryCode
      );
      
      if (error) {
        // Check if error message contains information about duplicate username or phone
        if (error.message && error.message.includes('username is already taken')) {
          setUsernameError(error.message);
          form.setError('username', { 
            type: 'manual', 
            message: '' // Remove duplicate message
          });
        } else if (error.message && (error.message.includes('User already registered') || 
                 error.message.includes('already exists'))) {
          setPhoneError('This phone number is already registered. Please use a different number or try logging in.');
          form.setError('phoneNumber', { 
            type: 'manual', 
            message: '' // Remove the duplicated message here
          });
        } else {
          // Handle other errors
          toast.error(error.message);
        }
        throw error;
      }
      
      if (success) {
        // Log successful registration before navigation
        console.log('Registration successful, redirecting to settings page');
        
        // Note: We've removed the toast here as it's now handled in the useSignUp hook
        
        // Navigate to settings page with replace:true to prevent back navigation to register page
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
              {/* Removing FormMessage here as it would show duplicate errors */}
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
              {phoneError && (
                <p className="text-sm font-medium text-destructive">{phoneError}</p>
              )}
              {/* Removing FormMessage here as it would show duplicate errors */}
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
