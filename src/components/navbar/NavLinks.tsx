
import { useLocation } from 'react-router-dom';
import { FileText, Award, Medal, Plus } from 'lucide-react';
import NavLink from './NavLink';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
        <Link to="/submit-review" className="ml-4">
          <Button size="sm" className="bg-brand-teal hover:bg-brand-teal/90 px-3">
            <Plus className="h-5 w-5 font-bold mr-2" strokeWidth={3} />
            <span>Write a Review</span>
          </Button>
        </Link>
      )}
    </>
  );
};

export default NavLinks;
