
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Star, Check, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Navbar from '@/components/Navbar';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasNumber && hasSpecial
    };
  };
  
  const passwordValidation = validatePassword(password);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid Password",
        description: "Please make sure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, hard code a success response
      toast({
        title: "Registration Successful",
        description: "Welcome to Review Rewards! You've earned 50 points for signing up.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-brand-teal/10 flex items-center justify-center rounded-full mb-4">
                <Star className="h-6 w-6 text-brand-teal" />
              </div>
              <h1 className="heading-3 mb-2">Create Your Account</h1>
              <p className="text-gray-600 text-sm">
                Join Review Rewards to start earning points
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="yourname@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-10"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* Password strength indicator */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center
                        ${passwordValidation.minLength ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
                    >
                      {passwordValidation.minLength && <Check className="h-3 w-3" />}
                    </div>
                    <span className={passwordValidation.minLength ? 'text-brand-teal' : 'text-gray-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center
                        ${passwordValidation.hasNumber ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
                    >
                      {passwordValidation.hasNumber && <Check className="h-3 w-3" />}
                    </div>
                    <span className={passwordValidation.hasNumber ? 'text-brand-teal' : 'text-gray-500'}>
                      At least 1 number
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center
                        ${passwordValidation.hasSpecial ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
                    >
                      {passwordValidation.hasSpecial && <Check className="h-3 w-3" />}
                    </div>
                    <span className={passwordValidation.hasSpecial ? 'text-brand-teal' : 'text-gray-500'}>
                      At least 1 special character
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>
              
              <div className="flex items-start gap-2">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal focus:ring-offset-0"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-brand-teal hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-brand-teal hover:underline">Privacy Policy</Link>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-brand-slate" />
              <span>Your data is securely encrypted and never shared.</span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-brand-teal hover:text-brand-darkTeal transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
