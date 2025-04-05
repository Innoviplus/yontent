
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const CallToActionSection = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-16 md:py-24 bg-brand-slate text-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="heading-2 mb-6">Ready to Start Earning Rewards?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Join our community today and turn your product experiences into valuable rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button asChild className="bg-white text-brand-slate hover:bg-gray-100">
                  <Link to="/missions">
                    Explore Missions
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/reviews">
                    Discover Reviews
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="bg-white text-brand-slate hover:bg-gray-100">
                  <Link to="/register">
                    Sign Up Now
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/login">
                    Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
