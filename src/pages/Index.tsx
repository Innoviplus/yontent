
import HeroSection from '@/components/home/HeroSection';
import FeaturedReviewsSection from '@/components/home/FeaturedReviewsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ActiveMissionsSection from '@/components/home/ActiveMissionsSection';
import Navbar from '@/components/Navbar';

const Index = () => {
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
