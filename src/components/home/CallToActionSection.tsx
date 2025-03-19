
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
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
  );
};

export default CallToActionSection;
