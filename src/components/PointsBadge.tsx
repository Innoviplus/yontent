
import { cn } from '@/lib/utils';

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

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium bg-brand-teal/10 text-brand-teal',
        sizes[size],
        className
      )}
    >
      <img 
        src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
        alt="Points" 
        className={cn(iconSizes[size])}
      />
      <span>{points} points</span>
    </div>
  );
};

export default PointsBadge;
