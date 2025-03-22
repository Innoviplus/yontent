
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 font-bold text-xl text-brand-slate hover:opacity-90 transition-opacity"
    >
      <img src="/lovable-uploads/8961935a-d5db-4ef3-b3aa-9b02ba0a0ca9.png" alt="Yontent" className="h-10" />
    </Link>
  );
};

export default Logo;
