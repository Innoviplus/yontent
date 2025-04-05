
import { Link } from 'react-router-dom';
import { Camera, Award, Star, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const HowItWorksSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="chip chip-primary mb-3">Simple Process</div>
            <h2 className="heading-2 mb-4">How Review Rewards Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to share your product experiences
              and get rewarded for your valuable feedback.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-brand-teal/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Camera className="h-6 w-6 text-brand-teal" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Reviews</h3>
              <p className="text-gray-600 text-sm">
                Post honest reviews about products you've purchased, including photos and detailed feedback.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-brand-slate/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-brand-slate" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Missions</h3>
              <p className="text-gray-600 text-sm">
                Take on missions like submitting receipts or reviewing specific product categories.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-brand-teal/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-brand-teal" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Earn Rewards</h3>
              <p className="text-gray-600 text-sm">
                Accumulate points for each activity, which can be redeemed for exclusive perks and rewards.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white font-medium inline-flex items-center gap-2">
              <Link to={user ? "/missions" : "/register"}>
                <span>{user ? "Explore Missions" : "Get Started"}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
