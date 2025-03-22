
import { Link } from 'react-router-dom';
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
        "flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 relative",
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

export default NavLink;
