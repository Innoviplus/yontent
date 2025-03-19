import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ArrowUpRight, ChevronRight, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import MissionCard from '@/components/MissionCard';
import { Review, Mission } from '@/lib/types';
import { useReviews } from '@/hooks/useReviews';
import { sampleMissions } from '@/data/sampleData';

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const { reviews, loading } = useReviews();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* New Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/30 to-brand-slate/20">
          <div className="absolute inset-0 opacity-15 bg-pattern-dots"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-subtle mb-6 animate-fade-in">
              <Star className="h-4 w-4 text-brand-teal" />
              <span className="text-sm font-medium text-gray-700">Share reviews. Complete missions. Earn rewards.</span>
            </div>
            
            <h1 className="heading-1 mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Get Rewarded for Your
              <span className="text-brand-teal block">Honest Reviews</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Join our community of reviewers, share your product experiences, 
              and earn points for every contribution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Link to="/register" className="btn-primary">
                Join Now
              </Link>
              <Link to="/reviews" className="btn-outline">
                Explore Reviews
              </Link>
            </div>
            
            <div className="py-2 px-4 bg-brand-slate/10 rounded-lg inline-flex items-center gap-2 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <Award className="h-5 w-5 text-brand-slate" />
              <span className="text-sm font-medium text-brand-slate">Over 10,000 members already earning rewards</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
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
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                <span>Get Started</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured reviews */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="chip chip-secondary mb-2">Featured</div>
              <h2 className="heading-2">Recent Reviews</h2>
            </div>
            <Link to="/reviews" className="flex items-center text-brand-slate hover:text-brand-lightSlate transition-colors">
              <span className="font-medium">View all</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 space-x-6">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                  <ReviewCard review={review} />
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="w-full py-8 text-center text-gray-500">
                  No reviews available yet. Be the first to share your experience!
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Active missions */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="chip chip-primary mb-2">Earn Points</div>
              <h2 className="heading-2">Active Missions</h2>
            </div>
            <Link to="/missions" className="flex items-center text-brand-slate hover:text-brand-lightSlate transition-colors">
              <span className="font-medium">View all</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 md:py-24 bg-brand-slate text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="heading-2 mb-6">Ready to Start Earning Rewards?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Join our community today and turn your product experiences into valuable rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-white text-brand-slate hover:bg-gray-100 px-6 py-2.5 rounded-md font-medium transition-colors duration-200">
                Sign Up Now
              </Link>
              <Link to="/login" className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-2.5 rounded-md font-medium transition-colors duration-200">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Star className="h-6 w-6 text-brand-teal" />
              <span className="font-bold text-xl text-brand-slate">Review Rewards</span>
            </div>
            
            <div className="flex flex-wrap gap-8 justify-center">
              <Link to="/reviews" className="text-gray-600 hover:text-brand-slate transition-colors">
                Reviews
              </Link>
              <Link to="/missions" className="text-gray-600 hover:text-brand-slate transition-colors">
                Missions
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-brand-slate transition-colors">
                About Us
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-brand-slate transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-brand-slate transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Review Rewards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
