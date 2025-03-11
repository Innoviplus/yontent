
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PointsBadge = ({ points, size = 'md', className }: PointsBadgeProps) => {
  const sizes = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4',
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium bg-brand-teal/10 text-brand-teal',
        sizes[size],
        className
      )}
    >
      <Award className={cn('text-brand-teal', {
        'h-3 w-3': size === 'sm',
        'h-4 w-4': size === 'md',
        'h-5 w-5': size === 'lg',
      })} />
      <span>{points} points</span>
    </div>
  );
};

export default PointsBadge;
