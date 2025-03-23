
import React from 'react';

const RewardDetailLoading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="w-20 h-20 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="h-10 bg-gray-200 rounded-full w-full"></div>
      </div>
    </div>
  );
};

export default RewardDetailLoading;
