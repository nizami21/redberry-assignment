import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-[384px] h-[455px] rounded-lg overflow-hidden shadow-lg bg-white animate-pulse">
      <div className="w-full h-[307px] bg-gray-300"></div>
      <div className="p-4">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;