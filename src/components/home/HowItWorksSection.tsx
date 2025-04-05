import { Link } from 'react-router-dom';
import { Star, Users, Gift, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
const HowItWorksSection = () => {
  const {
    user
  } = useAuth();
  return <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-teal/10 rounded-full mb-3">
              <span className="text-sm font-medium text-brand-teal">How It Works</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Turn Your Reviews Into Rewards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform makes it easy to share your product experiences
              and get rewarded for your valuable feedback.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Complete Missions */}
            <div className="bg-white rounded-xl p-8 shadow-card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Star className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Missions</h3>
              <p className="text-gray-600">
                Write reviews, create content, and complete tasks to earn points and rewards.
              </p>
            </div>
            
            {/* Join Communities */}
            <div className="bg-white rounded-xl p-8 shadow-card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Users className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Join Communities</h3>
              <p className="text-gray-600">
                Get handpicked for exclusive brand communities and special opportunities.
              </p>
            </div>
            
            {/* Redeem Rewards */}
            <div className="bg-white rounded-xl p-8 shadow-card text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Gift className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Redeem Rewards</h3>
              <p className="text-gray-600">
                Convert points into gift cards, cash, or exclusive products.
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
    </section>;
};
export default HowItWorksSection;