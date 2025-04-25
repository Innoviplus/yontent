
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RewardHeaderProps {
  title: string;
}

const RewardHeader: React.FC<RewardHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleNavigate = () => {
    navigate('/rewards');
  };

  return (
    <div 
      onClick={handleNavigate} 
      className={`flex items-center gap-2 cursor-pointer ${isMobile ? 'mb-4' : 'mb-8'}`}
    >
      <ArrowLeft className="h-4 w-4 text-brand-teal" />
      <h1 
        className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-brand-teal hover:underline`}
      >
        {title}
      </h1>
    </div>
  );
};

export default RewardHeader;
