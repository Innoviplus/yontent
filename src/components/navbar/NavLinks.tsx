
import { useLocation } from 'react-router-dom';
import { FileText, Award, Medal, Pencil, Gift, LayoutDashboard } from 'lucide-react';
import NavLink from './NavLink';
import { useAuth } from '@/contexts/AuthContext';

const NavLinks = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <>
      <NavLink 
        to="/reviews" 
        label="Reviews" 
        icon={<FileText className="h-5 w-5" />}
        current={location.pathname === '/reviews'}
      />
      <NavLink 
        to="/missions" 
        label="Missions" 
        icon={<Award className="h-5 w-5" />}
        current={location.pathname === '/missions' || location.pathname.includes('/mission/')}
      />
      <NavLink 
        to="/user-rankings" 
        label="Rankings" 
        icon={<Medal className="h-5 w-5" />}
        current={location.pathname.includes('/rankings') || location.pathname.includes('/user-rankings')}
      />
      
      {user && (
        <>
          <NavLink 
            to="/dashboard" 
            label="Dashboard" 
            icon={<LayoutDashboard className="h-5 w-5" />}
            current={location.pathname === '/dashboard'}
          />
          <NavLink 
            to="/submit-review" 
            label="Write a Review" 
            icon={<Pencil className="h-5 w-5" />}
            current={location.pathname === '/submit-review'}
          />
          <NavLink 
            to="/redeem" 
            label="Rewards" 
            icon={<Gift className="h-5 w-5" />}
            current={location.pathname === '/redeem' || location.pathname.includes('/rewards/')}
          />
        </>
      )}
    </>
  );
};

export default NavLinks;
