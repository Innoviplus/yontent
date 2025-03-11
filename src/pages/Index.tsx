
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ArrowUpRight, ChevronRight, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import MissionCard from '@/components/MissionCard';
import { Review, Mission } from '@/lib/types';

// Sample data
const sampleReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    productName: 'Wireless Headphones',
    rating: 5,
    content: 'These headphones have amazing sound quality and the noise cancellation is top-notch. Battery life is exceptional - I can go days without charging. The comfort level is also great for long listening sessions.',
    images: ['/placeholder.svg'],
    createdAt: new Date('2023-09-15'),
    user: {
      id: '1',
      username: 'audiophile',
      email: 'audio@example.com',
      points: 750,
      createdAt: new Date('2023-01-10')
    }
  },
  {
    id: '2',
    userId: '2',
    productName: 'Smart Watch Series 7',
    rating: 4,
    content: 'Great fitness tracking capabilities and the screen is beautiful. Battery life could be better but overall very satisfied with the purchase.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    createdAt: new Date('2023-10-05'),
    user: {
      id: '2',
      username: 'techgeek',
      email: 'tech@example.com',
      points: 450,
      createdAt: new Date('2023-03-22')
    }
  },
  {
    id: '3',
    userId: '3',
    productName: 'Coffee Machine Deluxe',
    rating: 5,
    content: 'Makes perfect coffee every time. Easy to clean and the programmable timer is a lifesaver for busy mornings.',
    images: ['/placeholder.svg'],
    createdAt: new Date('2023-11-20'),
    user: {
      id: '3',
      username: 'coffeelover',
      email: 'coffee@example.com',
      points: 920,
      createdAt: new Date('2023-02-14')
    }
  }
];

const sampleMissions: Mission[] = [
  {
    id: '1',
    title: 'Review Your Recent Electronics',
    description: 'Share your honest opinion about any electronics product you purchased in the last 3 months.',
    pointsReward: 150,
    type: 'REVIEW',
    status: 'ACTIVE',
    expiresAt: new Date('2024-01-31'),
    requirementDescription: 'Post a review with at least one photo and 100+ words.'
  },
  {
    id: '2',
    title: 'Holiday Shopping Receipt',
    description: 'Submit a receipt from your holiday shopping for a chance to earn points.',
    pointsReward: 100,
    type: 'RECEIPT',
    status: 'ACTIVE',
    expiresAt: new Date('2024-01-15'),
    requirementDescription: 'Upload a clear photo of your receipt showing date and store name.'
  },
  {
    id: '3',
    title: 'Home Appliance Review',
    description: 'Share your experience with a home appliance you use regularly.',
    pointsReward: 200,
    type: 'REVIEW',
    status: 'ACTIVE',
    expiresAt: new Date('2024-02-28'),
    requirementDescription: 'Post a detailed review covering pros, cons, and usage tips.'
  }
];

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  
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
        <div className="absolute inset-0 bg-gradient-to-br from-brand-slate/10 to-brand-teal/5" />
        
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
        
        {/* Floating cards effect */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4">
          <div className="relative h-32 md:h-44">
            <div 
              className="absolute left-[10%] top-0 w-64 h-auto glass-card rounded-xl shadow-elevation transform opacity-70 blur-[1px] transition-all duration-200" 
              style={{ transform: `translateY(${scrollY * -0.1}px) rotate(-5deg)` }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-xs line-clamp-2">Amazing headphones! Sound quality is incredible and they're so comfortable.</p>
              </div>
            </div>
            
            <div 
              className="absolute left-[60%] top-2 w-56 h-auto glass-card rounded-xl shadow-elevation transition-all duration-200" 
              style={{ transform: `translateY(${scrollY * -0.17}px) rotate(3deg)` }}
            >
              <div className="p-3">
                <div className="text-xs font-medium mb-1 flex items-center">
                  <Camera className="h-3 w-3 mr-1" />
                  <span>Recent Review</span>
                </div>
                <div className="flex gap-1 mb-1">
                  {Array(4).fill(0).map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star className="h-3 w-3 text-gray-300" />
                </div>
                <p className="text-xs line-clamp-1">Perfect coffee maker for my morning routine!</p>
              </div>
            </div>
            
            <div 
              className="absolute left-[30%] top-10 w-60 h-auto glass-card rounded-xl shadow-elevation transition-all duration-200" 
              style={{ transform: `translateY(${scrollY * -0.12}px) rotate(-2deg)` }}
            >
              <div className="p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Mission Completed</span>
                  <div className="bg-brand-teal/20 text-brand-teal text-xs rounded-full px-2 py-0.5">+100 pts</div>
                </div>
                <p className="text-xs line-clamp-2">You earned points for your smartphone review!</p>
              </div>
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
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
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Review Rewards. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
