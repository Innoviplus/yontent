
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <img src="/lovable-uploads/2dce8c5f-aa6c-4a38-8581-e6d4a177e9c0.png" alt="Logo" className="h-10" />
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center">
            <Link to="/reviews" className="text-gray-600 hover:text-brand-slate transition-colors">
              Reviews
            </Link>
            <Link to="/missions" className="text-gray-600 hover:text-brand-slate transition-colors">
              Missions
            </Link>
            <Link to="/rewards" className="text-gray-600 hover:text-brand-slate transition-colors">
              Rewards
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
          <p>© {new Date().getFullYear()} Yontent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
