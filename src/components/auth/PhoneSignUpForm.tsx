
import { useState } from 'react';
import { Form } from '@/components/ui/form';
import OTPVerification from './otp/OTPVerification';
import SignUpFormFields from './signup/SignUpFormFields';
import { usePhoneSignUpForm } from '@/hooks/auth/usePhoneSignUpForm';

const PhoneSignUpForm = () => {
  const [userCountry] = useState('SG'); // Default and lock to Singapore
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
