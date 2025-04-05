import { Link } from 'react-router-dom';
import { Star, Award, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
const HeroSection = () => {
  const {
    user
  } = useAuth();
  return <section className="pt-28 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-brand-slate/10">
        <div className="absolute inset-0 opacity-15 bg-pattern-dots"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-subtle mb-6 animate-fade-in">
            <Star className="h-4 w-4 text-brand-teal" />
            <span className="text-sm font-medium text-gray-700">Share reviews. Complete missions. Earn rewards.</span>
          </div>
          
          <h1 style={{
          animationDelay: '100ms'
        }} className="text-4xl font-bold text-gray-900 mb-6 animate-fade-up md:text-4xl">
            Get Rewarded for Your
            <span className="text-brand-teal block mt-2">Honest Reviews</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 animate-fade-up" style={{
          animationDelay: '200ms'
        }}>Join our community of reviewers, share your product experiences, and earn points for completing missions.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-up" style={{
          animationDelay: '300ms'
        }}>
            <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium">
              <Link to={user ? "/submit-review" : "/register"}>
                {user ? "Write a Review" : "Join Now"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/reviews">
                Explore Reviews
              </Link>
            </Button>
          </div>
          
          <div className="py-2 px-4 bg-brand-slate/10 rounded-lg inline-flex items-center gap-2 animate-fade-up" style={{
          animationDelay: '400ms'
        }}>
            <Award className="h-5 w-5 text-brand-slate" />
            <span className="text-sm font-medium text-brand-slate">Over 10,000 members already earning rewards</span>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;