
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  userProfile: any | null;
  refreshUserProfile: () => Promise<void>;
  signUpWithPhone: (phone: string, username: string, email: string, password?: string) => Promise<{ error: any, phoneNumber?: string }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ error: any }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: any }>;
  resendOtp: (phone: string) => Promise<{ error: any }>;
}
