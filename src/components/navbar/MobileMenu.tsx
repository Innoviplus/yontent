
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const location = useLocation();
  const { user, signOut, userProfile } = useAuth();
  
  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 bg-white shadow-md overflow-hidden transition-all duration-300 md:hidden",
        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="px-4 py-5 space-y-3">
        <NavLinks />
        
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
                <img 
                  src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
                  alt="Points" 
                  className="h-4 w-4" 
                />
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
  );
};

export default MobileMenu;

