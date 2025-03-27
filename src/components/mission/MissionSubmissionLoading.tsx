
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const MissionSubmissionLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          <span className="ml-2 text-gray-600">Loading mission details...</span>
        </div>
      </div>
    </div>
  );
};

export default MissionSubmissionLoading;
