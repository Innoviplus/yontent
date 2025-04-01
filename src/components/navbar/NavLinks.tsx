
import { useLocation } from 'react-router-dom';
import { FileText, Award, Pencil, Gift } from 'lucide-react';
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
        current={location.pathname === '/reviews' || location.pathname.includes('/review/')}
      />
      <NavLink 
        to="/missions" 
        label="Missions" 
        icon={<Award className="h-5 w-5" />}
        current={location.pathname === '/missions' || location.pathname.includes('/mission/')}
      />
      <NavLink 
        to="/rewards" 
        label="Rewards" 
        icon={<Gift className="h-5 w-5" />}
        current={location.pathname === '/rewards' || location.pathname.includes('/reward/')}
      />
      
      {user && (
        <NavLink 
          to="/submit-review" 
          label="Write a Review" 
          icon={<Pencil className="h-5 w-5" />}
          current={location.pathname === '/submit-review'}
        />
      )}
    </>
  );
};

export default NavLinks;
