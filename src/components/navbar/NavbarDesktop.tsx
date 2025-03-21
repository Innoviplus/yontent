
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import NavLinks from './NavLinks';
import UserMenuDropdown from './UserMenuDropdown';

const NavbarDesktop = () => {
  const { user } = useAuth();
  
  return (
    <nav className="hidden md:flex items-center gap-1">
      <NavLinks />
      
      {user ? (
        <UserMenuDropdown />
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
  );
};

export default NavbarDesktop;
