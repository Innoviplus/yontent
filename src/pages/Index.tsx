
import { useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedReviewsSection from '@/components/home/FeaturedReviewsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ActiveMissionsSection from '@/components/home/ActiveMissionsSection';
import Navbar from '@/components/Navbar';

const Index = () => {
  useEffect(() => {
    document.title = "Yontent Singapore";
    // Update meta description for SEO
    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", "Share reviews. Earn rewards. Get Recognised for Your Brand Love");
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturedReviewsSection />
      <ActiveMissionsSection />
    </div>
  );
};

export default Index;
