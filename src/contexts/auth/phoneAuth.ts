
import { usePhoneSignUp } from '@/hooks/auth/usePhoneSignUp';
import { usePhoneSignIn } from '@/hooks/auth/usePhoneSignIn';
import { useOTPVerification } from '@/hooks/auth/useOTPVerification';

export function usePhoneAuth(setUserProfile: (profile: any) => void) {
  const { signUpWithPhone, pendingRegistrations } = usePhoneSignUp();
  const { signInWithPhone, completeSignIn } = usePhoneSignIn();
  const { verifyPhoneOtp, resendVerificationCode } = useOTPVerification(setUserProfile);

  return {
    signUpWithPhone,
    signInWithPhone,
    verifyPhoneOtp,
    resendOtp: resendVerificationCode,
    pendingRegistrations
  };
}
