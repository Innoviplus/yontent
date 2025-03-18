
import { Link } from 'react-router-dom';
import { Camera, Receipt, Award, ChevronRight } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Link 
        to="/submit-review" 
        className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-subtle hover:-translate-y-1 transition-transform duration-200"
      >
        <div className="bg-brand-teal/10 w-12 h-12 rounded-xl flex items-center justify-center">
          <Camera className="h-6 w-6 text-brand-teal" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Submit a Review</h3>
          <p className="text-sm text-gray-600">Share your product experience</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
      </Link>
      
      <Link 
        to="/submit-receipt" 
        className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-subtle hover:-translate-y-1 transition-transform duration-200"
      >
        <div className="bg-brand-slate/10 w-12 h-12 rounded-xl flex items-center justify-center">
          <Receipt className="h-6 w-6 text-brand-slate" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Upload Receipt</h3>
          <p className="text-sm text-gray-600">Complete receipt missions</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
      </Link>
      
      <Link 
        to="/missions" 
        className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-subtle hover:-translate-y-1 transition-transform duration-200"
      >
        <div className="bg-brand-teal/10 w-12 h-12 rounded-xl flex items-center justify-center">
          <Award className="h-6 w-6 text-brand-teal" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Explore Missions</h3>
          <p className="text-sm text-gray-600">Find new ways to earn points</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 ml-auto" />
      </Link>
    </div>
  );
};

export default QuickActions;
