
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import FeaturedReviewsSection from '@/components/home/FeaturedReviewsSection';
import ActiveMissionsSection from '@/components/home/ActiveMissionsSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';
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
      <HeroSection />
      <HowItWorksSection />
      <FeaturedReviewsSection reviews={reviews} loading={loading} />
      <ActiveMissionsSection missions={sampleMissions} />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Index;
