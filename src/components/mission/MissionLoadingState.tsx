
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

interface MissionLoadingStateProps {
  type: 'loading' | 'notFound';
}

const MissionLoadingState = ({ type }: MissionLoadingStateProps) => {
  if (type === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4">
          <div className="animate-pulse bg-white h-96 rounded-xl mb-8"></div>
          <div className="animate-pulse bg-white h-72 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Mission not found</h1>
        <p className="mb-8">The mission you're looking for does not exist or has been removed.</p>
        <Link to="/missions">
          <Button>Back to Missions</Button>
        </Link>
      </div>
    </div>
  );
};

export default MissionLoadingState;
