
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authService from '@/services/auth/authService';
import { fetchUserProfile } from '@/services/profile/profileService';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signIn: async () => ({ error: new Error('AuthProvider not initialized') }),
  signUp: async () => ({ error: new Error('AuthProvider not initialized') }),
  signOut: async () => { throw new Error('AuthProvider not initialized') },
  loading: true,
  userProfile: null,
  refreshUserProfile: async () => { throw new Error('AuthProvider not initialized') },
  signUpWithPhone: async () => ({ error: new Error('AuthProvider not initialized') }),
  signInWithPhone: async () => ({ error: new Error('AuthProvider not initialized') }),
  verifyPhoneOtp: async () => ({ error: new Error('AuthProvider not initialized') }),
  resendOtp: async () => ({ error: new Error('AuthProvider not initialized') }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const { toast } = useToast();

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profileData = await fetchUserProfile(user.id, user.email);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      }
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(async () => {
            try {
              const data = await fetchUserProfile(newSession.user.id, newSession.user.email);
              setUserProfile(data);
            } catch (err) {
              console.error("Error fetching profile on auth change:", err);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? `Found session for ${currentSession.user.email}` : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession.user.email)
          .then(data => {
            setUserProfile(data);
          })
          .catch(err => {
            console.error("Error fetching initial profile:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.error) {
      toast({
        title: "Login Failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    return result;
  };

  const signInWithPhone = async (phone: string, password: string) => {
    console.log("AuthContext: signInWithPhone called with phone:", phone);
    const result = await authService.signInWithPhone(phone, password);
    if (result.error) {
      toast({
        title: "Login Failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    return result;
  };

  const signUp = async (email: string, password: string, username: string) => {
    const result = await authService.signUp(email, password, username);
    if (result.error) {
      toast({
        title: "Registration Failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    return result;
  };

  // We'll store registration data in the context temp storage instead of creating the user immediately
  const pendingPhoneRegistrations = new Map();

  const signUpWithPhone = async (phone: string, username: string, email: string, password?: string) => {
    try {
      console.log("AuthContext: signUpWithPhone called with:", {phone, username, email, hasPassword: !!password});
      
      // Check if username already exists
      const { data: existingUsernames, error: usernameCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username);
        
      if (usernameCheckError) {
        console.error('Error checking existing username:', usernameCheckError);
      } else if (existingUsernames && existingUsernames.length > 0) {
        toast({
          title: "Registration Failed",
          description: "This username is already taken. Please choose a different one.",
          variant: "destructive",
        });
        return { error: { message: "Username already taken" } };
      }
      
      // Check if email already exists
      const { data: existingEmails, error: emailCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
        
      if (emailCheckError) {
        console.error('Error checking existing email:', emailCheckError);
      } else if (existingEmails && existingEmails.length > 0) {
        toast({
          title: "Registration Failed",
          description: "This email is already registered. Please use a different email.",
          variant: "destructive",
        });
        return { error: { message: "Email already registered" } };
      }
      
      // Check if phone already exists
      const { data: existingPhones, error: phoneCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phone.replace(/\D/g, ''));
        
      if (phoneCheckError) {
        console.error('Error checking existing phone:', phoneCheckError);
      } else if (existingPhones && existingPhones.length > 0) {
        toast({
          title: "Registration Failed",
          description: "This phone number is already registered. Please use a different number.",
          variant: "destructive",
        });
        return { error: { message: "Phone number already registered" } };
      }
      
      // Store registration data but don't create user yet
      pendingPhoneRegistrations.set(phone, {
        username,
        email,
        password: password || '',
        phone_number: phone.replace(/\D/g, ''),
        phone_country_code: '+'
      });
      
      // Send OTP
      const { error: otpError } = await authService.sendOtp(phone);
      
      if (otpError) {
        console.error("Error sending OTP:", otpError);
        toast({
          title: "Registration Failed",
          description: otpError.message || "Failed to send verification code",
          variant: "destructive",
        });
        return { error: otpError };
      }

      toast({
        title: "Verification Code Sent",
        description: "Please enter the code sent to your phone number",
      });
      
      return { error: null, phoneNumber: phone };
    } catch (error: any) {
      console.error("Exception during phone signup:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      // Verify the OTP first
      const { error: verifyError } = await authService.verifyOtp(phone, token);
      
      if (verifyError) {
        toast({
          title: "Verification Failed",
          description: verifyError.message || "Invalid verification code",
          variant: "destructive",
        });
        return { error: verifyError };
      }
      
      // If verification successful, get the registration data
      const userData = pendingPhoneRegistrations.get(phone);
      
      if (!userData) {
        console.error("No pending registration found for this phone number");
        toast({
          title: "Registration Failed",
          description: "Registration data not found. Please try signing up again.",
          variant: "destructive",
        });
        return { error: { message: "Registration data not found" } };
      }
      
      // Now create the user
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error("Error during signup after OTP verification:", error);
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Remove the pending registration
      pendingPhoneRegistrations.delete(phone);
      
      // Let's make sure the profile is properly updated with the email
      if (data.user) {
        console.log("User created successfully, updating profile if needed");
        
        // Wait a moment for the trigger to create the profile
        setTimeout(async () => {
          try {
            // Check if the profile has the correct email
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('email, id')
              .eq('id', data.user!.id)
              .single();
            
            if (profileError) {
              console.error("Error checking profile:", profileError);
              return;
            }
            
            // If email is missing or different, update it
            if (!profile.email || profile.email !== userData.email) {
              console.log("Updating profile email from", profile.email, "to", userData.email);
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ email: userData.email })
                .eq('id', data.user!.id);
                
              if (updateError) {
                console.error("Failed to update profile email:", updateError);
              } else {
                console.log("Profile email updated successfully");
              }
            }
          } catch (e) {
            console.error("Error in profile update check:", e);
          }
        }, 1000);
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Exception during OTP verification:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };
  
  const resendOtp = async (phone: string) => {
    try {
      const { error } = await authService.resendOtp(phone);
      
      if (error) {
        toast({
          title: "Failed to Resend Code",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your phone",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Failed to Resend Code",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const contextValue = {
    session,
    user,
    signIn,
    signUp,
    signOut: authService.signOut,
    loading,
    userProfile,
    refreshUserProfile,
    signUpWithPhone,
    signInWithPhone,
    verifyPhoneOtp,
    resendOtp,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
