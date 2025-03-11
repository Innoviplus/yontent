
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Star, Award, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  current: boolean;
}

const NavLink = ({ to, label, icon, current }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200",
        current 
          ? "bg-brand-teal/10 text-brand-teal font-medium" 
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Mock auth state
  const isAuthenticated = false;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-subtle py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl text-brand-slate hover:opacity-90 transition-opacity"
        >
          <Star className="h-6 w-6 text-brand-teal" />
          <span>Review Rewards</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink 
            to="/reviews" 
            label="Reviews" 
            icon={<Star className="h-5 w-5" />}
            current={location.pathname === '/reviews'}
          />
          <NavLink 
            to="/missions" 
            label="Missions" 
            icon={<Award className="h-5 w-5" />}
            current={location.pathname === '/missions'}
          />
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/dashboard" 
                label="Dashboard" 
                icon={<User className="h-5 w-5" />}
                current={location.pathname === '/dashboard'}
              />
              <button className="ml-2 flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center ml-2 gap-2">
              <Link 
                to="/login" 
                className="px-5 py-2 text-brand-teal hover:bg-gray-100 rounded-md font-medium transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-white shadow-md overflow-hidden transition-all duration-300 md:hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-5 space-y-3">
          <NavLink 
            to="/reviews" 
            label="Reviews" 
            icon={<Star className="h-5 w-5" />}
            current={location.pathname === '/reviews'}
          />
          <NavLink 
            to="/missions" 
            label="Missions" 
            icon={<Award className="h-5 w-5" />}
            current={location.pathname === '/missions'}
          />
          
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/dashboard" 
                label="Dashboard" 
                icon={<User className="h-5 w-5" />}
                current={location.pathname === '/dashboard'}
              />
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link 
                to="/login" 
                className="w-full text-center px-5 py-2.5 text-brand-teal border border-brand-teal hover:bg-brand-teal/5 rounded-md font-medium transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="w-full text-center btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
