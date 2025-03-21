
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProfileNotFound = () => {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-card">
      <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
      <p className="text-gray-600 mb-6">
        The user you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/reviews">
        <Button className="bg-brand-teal hover:bg-brand-teal/90">
          Back to Reviews
        </Button>
      </Link>
    </div>
  );
};

export default ProfileNotFound;
