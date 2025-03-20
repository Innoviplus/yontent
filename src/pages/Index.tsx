
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import FeaturedReviewsSection from '@/components/home/FeaturedReviewsSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';
import { useReviews } from '@/hooks/useReviews';

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
      <HeroSection />
      <HowItWorksSection />
      <FeaturedReviewsSection reviews={reviews} loading={loading} />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Index;
