
import { useAuth } from '@/contexts/AuthContext';

const DashboardError = () => {
  const { signOut } = useAuth();
  
  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
      <div className="bg-white rounded-xl p-8 text-center shadow-card">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Could not load profile</h3>
        <p className="text-gray-600 mb-6">
          There was an error loading your profile. Please try again later.
        </p>
        <button onClick={() => signOut()} className="btn-primary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardError;
