
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhoneNumberInput from '@/components/auth/PhoneNumberInput';

const emailLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const phoneLoginSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userCountry, setUserCountry] = useState('HK');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const {
    signIn,
    signInWithPhone,
    user
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to dashboard
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  
  const emailForm = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  const phoneForm = useForm<PhoneLoginFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: '',
      password: ''
    }
  });
  
  const isEmailLoading = emailForm.formState.isSubmitting;
  const isPhoneLoading = phoneForm.formState.isSubmitting;

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

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to:", from);
      navigate(from, {
        replace: true
      });
    }
  }, [user, navigate, from]);
  
  const onEmailSubmit = async (values: EmailLoginFormValues) => {
    try {
      const {
        error
      } = await signIn(values.email, values.password);
      if (error) {
        // Display the specific error message from Supabase
        toast.error(error.message || "Invalid email or password");
        return;
      }
      toast.success("Login successful!");
      console.log("Login successful, redirecting to:", from);
      navigate(from, {
        replace: true
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };
  
  const onPhoneSubmit = async (values: PhoneLoginFormValues) => {
    try {
      const {
        error
      } = await signInWithPhone(values.phone, values.password);
      if (error) {
        // Display the specific error message from Supabase
        toast.error(error.message || "Invalid phone number or password");
        return;
      }
      toast.success("Login successful!");
      console.log("Login successful, redirecting to:", from);
      navigate(from, {
        replace: true
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-md">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-brand-teal/10 flex items-center justify-center rounded-full mb-4">
                <Star className="h-6 w-6 text-brand-teal" />
              </div>
              <h1 className="heading-3 mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-sm">Sign in to your Yontent account</p>
            </div>
            
            <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                    <FormField control={emailForm.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="yourname@example.com" type="email" autoComplete="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={emailForm.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <Link to="/forgot-password" className="text-xs text-brand-teal hover:text-brand-darkTeal transition-colors">
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="••••••••" type={showPassword ? "text" : "password"} autoComplete="current-password" {...field} />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <Button type="submit" disabled={isEmailLoading} className="w-full bg-brand-teal hover:bg-brand-darkTeal" variant="default" size="default">
                      {isEmailLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="phone">
                <Form {...phoneForm}>
                  <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-5">
                    <FormField control={phoneForm.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <PhoneNumberInput
                              value={field.value}
                              onChange={field.onChange}
                              defaultCountry={userCountry}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={phoneForm.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <Link to="/forgot-password" className="text-xs text-brand-teal hover:text-brand-darkTeal transition-colors">
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="••••••••" type={showPassword ? "text" : "password"} autoComplete="current-password" {...field} />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <Button type="submit" disabled={isPhoneLoading} className="w-full bg-brand-teal hover:bg-brand-darkTeal" variant="default" size="default">
                      {isPhoneLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-brand-teal hover:text-brand-darkTeal transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
