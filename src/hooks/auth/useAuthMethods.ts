
import { useSignIn } from './useSignIn';
import { useSignUp } from './useSignUp';
import { useSignOut } from './useSignOut';

export function useAuthMethods() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useSignOut();

  return {
    signIn,
    signUp,
    signOut
  };
}
