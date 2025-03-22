
import { useLocation } from 'react-router-dom';
import { FileText, Award, Medal, MessageSquare, Pencil } from 'lucide-react';
import NavLink from './NavLink';
import { Link } from 'react-router-dom';
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
        current={location.pathname === '/missions'}
      />
      <NavLink 
        to="/rankings" 
        label="Rankings" 
        icon={<Medal className="h-5 w-5" />}
        current={location.pathname === '/rankings'}
      />
      
      {user && (
        <NavLink 
          to="/submit-review" 
          label="Write a Review" 
          icon={<MessageSquare className="h-5 w-5" />}
          current={location.pathname === '/submit-review'}
        />
      )}
    </>
  );
};

export default NavLinks;
