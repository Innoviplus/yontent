
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 font-bold text-xl text-brand-slate hover:opacity-90 transition-opacity"
    >
      <img src="/logo.png" alt="Review Rewards" className="h-8" />
    </Link>
  );
};

export default Logo;
