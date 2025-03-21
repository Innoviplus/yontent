
import { useLocation } from 'react-router-dom';
import { Star, Award, Medal } from 'lucide-react';
import NavLink from './NavLink';

const NavLinks = () => {
  const location = useLocation();
  
  return (
    <>
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
      <NavLink 
        to="/rankings" 
        label="Rankings" 
        icon={<Medal className="h-5 w-5" />}
        current={location.pathname === '/rankings'}
      />
    </>
  );
};

export default NavLinks;
