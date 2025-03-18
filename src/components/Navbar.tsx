import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Star, Award, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const { user, signOut, userProfile } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-xl text-brand-slate hover:opacity-90 transition-opacity"
        >
          <Star className="h-6 w-6 text-brand-teal" />
          <span>Review Rewards</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink 
            to="/reviews" 
            label="Features" 
            icon={<Star className="h-5 w-5" />}
            current={location.pathname === '/reviews'}
          />
          <NavLink 
            to="/missions" 
            label="Missions" 
            icon={<Award className="h-5 w-5" />}
            current={location.pathname === '/missions'}
          />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-100">
                <Avatar>
                  <AvatarImage src={userProfile?.avatar} />
                  <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                    {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userProfile?.username}</span>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center gap-2">
                  <div className="text-brand-teal font-medium">{userProfile?.points || 0} points</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      <div
        className={cn(
          "absolute top-full left-0 right-0 bg-white shadow-md overflow-hidden transition-all duration-300 md:hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-5 space-y-3">
          <NavLink 
            to="/reviews" 
            label="Features" 
            icon={<Star className="h-5 w-5" />}
            current={location.pathname === '/reviews'}
          />
          <NavLink 
            to="/missions" 
            label="Missions" 
            icon={<Award className="h-5 w-5" />}
            current={location.pathname === '/missions'}
          />
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              >
                <User className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
              {userProfile && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-teal/10 text-brand-teal rounded-md">
                  <span className="font-medium">{userProfile.points}</span>
                  <span className="text-sm">points</span>
                </div>
              )}
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
