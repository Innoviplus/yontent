
import { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import OTPVerification from './otp/OTPVerification';
import SignUpFormFields from './signup/SignUpFormFields';
import { usePhoneSignUpForm } from '@/hooks/auth/usePhoneSignUpForm';

const PhoneSignUpForm = () => {
  const [userCountry, setUserCountry] = useState('HK');
  const {
    form,
    showOTP,
    phoneNumber,
    showPassword,
    isSubmitting,
    setShowPassword,
    handleSignUp,
    handleVerifyOtp,
    handleResendOtp,
    setShowOTP
  } = usePhoneSignUpForm();

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

  if (showOTP) {
    return (
      <OTPVerification 
        phoneNumber={phoneNumber} 
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onCancel={() => setShowOTP(false)}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-6">
        <SignUpFormFields
          form={form}
          userCountry={userCountry}
          showPassword={showPassword}
          isSubmitting={isSubmitting}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </form>
    </Form>
  );
};

export default PhoneSignUpForm;
