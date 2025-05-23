import { Link } from 'react-router-dom';
import { Star, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="w-full min-h-[85vh] relative flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-white to-brand-slate/5">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-24 h-24 bg-brand-teal/10 rounded-full blur-3xl animate-pulse-gentle"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-brand-slate/10 rounded-full blur-3xl animate-pulse-gentle" style={{
      animationDelay: '1s'
    }}></div>
      
      {/* Main content container */}
      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-8 animate-fade-in">
            <Star className="h-4 w-4 text-brand-teal" />
            <span className="text-sm font-medium text-gray-700 text-left">Get Recognised for Your
Brand Love</span>
            <Sparkles className="h-4 w-4 text-brand-teal ml-1" />
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6 animate-fade-up text-center md:text-7xl">
            Share reviews.
            <span className="bg-gradient-to-r from-brand-teal to-brand-slate bg-clip-text text-transparent block mt-2">
              Earn rewards.
            </span>
          </h1>
          
          {/* Subheading */}
          <p style={{
          animationDelay: '200ms'
        }} className="text-xl text-gray-600 mb-8 animate-fade-up max-w-2xl mx-auto text-center md:text-sm">Join our community of reviewers, share your experiences, and earn points for every completed mission</p>
          
          {/* CTA Buttons - Updated sizes and text */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up" style={{
          animationDelay: '300ms'
        }}>
            <Button asChild size="default" className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium">
              <Link to={user ? "/submit-review" : "/register"}>
                {user ? "Write a Review" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default">
              <Link to="/reviews">
                Explore Reviews
              </Link>
            </Button>
          </div>
          
          {/* Social proof */}
          <div className="flex justify-center">
            <div className="py-3 px-4 bg-brand-slate/5 rounded-2xl inline-flex items-center gap-2 animate-fade-up">
              <Award className="h-5 w-5 text-brand-slate" />
              <span className="text-sm font-medium text-brand-slate">Over 10,000 members already earning rewards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
