import Header from "../Header";

const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const ListingPageSkeleton = () => {
    return (
        <div className="bg-white min-w-screen min-h-[screen] font-firaGo font-sans text-[#021526]">
            <Header />
            <div className="max-w-[1591px] mx-auto mt-32">
                <div className="flex gap-[68px]">
                    <div className="w-[839px]">
                        <Skeleton className="rounded-t-[14px] w-full h-[670px]" />
                        <div className="flex justify-end py-[14px]">
                            <Skeleton className="w-48 h-4" />
                        </div>
                    </div>

                    <div className="w-[503px] flex flex-col">
                        <div className="pt-[30px] min-h-[246px]">
                            <Skeleton className="w-3/4 h-14 mb-6" />
                            <div className="space-y-4 mb-6">
                                {[...Array(4)].map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                        <Skeleton className="w-2/3 h-7" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Skeleton className="w-full h-28 mt-6 mb-4" />

                        <div className="mt-6 mb-[42px]">
                            <div className="border border-gray-300 p-4 rounded-lg w-full mb-4">
                                <div className="flex items-center">
                                    <Skeleton className="w-16 h-16 rounded-full mr-4" />
                                    <div>
                                        <Skeleton className="w-40 h-5 mb-2" />
                                        <Skeleton className="w-24 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <Skeleton className="w-full h-4" />
                                    <Skeleton className="w-full h-4" />
                                </div>
                            </div>
                            <Skeleton className="w-1/4 h-[34px]" />
                        </div>
                    </div>
                </div>

                <div className="mt-[84px] mb-[150px]">
                    <Skeleton className="w-64 h-8 mb-[52px]" />
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="pr-4">
                                <Skeleton className="w-full h-64 mb-3" />
                                <Skeleton className="w-3/4 h-6 mb-2" />
                                <Skeleton className="w-1/2 h-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingPageSkeleton;