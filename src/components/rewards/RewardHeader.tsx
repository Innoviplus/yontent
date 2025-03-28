
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RewardHeaderProps {
  title: string;
}

const RewardHeader: React.FC<RewardHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 mb-8">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/rewards')}
        className="rounded-full"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
};

export default RewardHeader;
