import React from 'react';

const Skeleton = ({ width, height, className }) => (
    <div
        className={`bg-gray-300 animate-pulse rounded ${className}`}
        style={{ width, height }}
    />
);

const FilterBarSkeleton = () => {
    return (
        <div className="w-full mb-10 bg-white">
            <div className="flex justify-between items-center w-full max-w-[1596px] mx-auto">
                <div className="flex items-center w-[785px] h-[47px] bg-gray-200  rounded-md p-[6px]">
                    <Skeleton width={120} height={30} className="ml-4" />
                    <Skeleton width={200} height={30} className="ml-4" />
                    <Skeleton width={125} height={30} className="ml-4" />
                    <Skeleton width={250} height={30} className="ml-4" />

                </div>
                <div className="flex space-x-4">
                    <Skeleton width={230} height={47} className="rounded-md" />
                    <Skeleton width={200} height={47} className="rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default FilterBarSkeleton;