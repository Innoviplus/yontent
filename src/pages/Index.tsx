
import HeroSection from '@/components/home/HeroSection';
import FeaturedReviewsSection from '@/components/home/FeaturedReviewsSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CallToActionSection from '@/components/home/CallToActionSection';
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
      
      <CallToActionSection />
    </div>
  );
};

export default Index;
