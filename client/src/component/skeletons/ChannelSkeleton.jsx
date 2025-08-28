import VideoCardSkeleton from "./VideoCardSkeleton";

const ChannelSkeleton = () => {
  return (
    <>
      {/* Cover Image Skeleton */}
      <div className="relative min-h-[150px] w-full pt-[16.28%] animate-pulse">
        <div className="absolute inset-0 overflow-hidden bg-gray-300 dark:bg-gray-700"></div>
      </div>

      {/* Profile and Info Skeleton */}
      <div className="bg-white px-4 pb-4 dark:bg-[#121212]">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          {/* Profile Image Skeleton */}
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-[#e5e7eb] animate-pulse">
            <div className="h-full w-full bg-gray-300 dark:bg-gray-700"></div>
          </span>

          <div className="mr-auto inline-block animate-pulse">
            {/* Channel Name Skeleton */}
            <div className="h-6 w-48 mb-2 rounded bg-gray-300 dark:bg-gray-700"></div>
            {/* Username Skeleton */}
            <div className="h-4 w-32 mb-1 rounded bg-gray-300 dark:bg-gray-700"></div>
            {/* Subscriber Count Skeleton */}
            <div className="h-4 w-40 rounded bg-gray-300 dark:bg-gray-700"></div>
          </div>

          <div className="inline-block animate-pulse">
            <div className="inline-flex min-w-[145px] justify-end">
              {/* Subscribe Button Skeleton */}
              <div className="h-10 w-32 rounded-md bg-gray-300 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Skeleton */}
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-200 bg-white py-2 dark:border-gray-400 dark:bg-[#121212] sm:top-[82px] animate-pulse">
          <li className="w-full">
            <div className="w-full h-8 rounded bg-gray-300 dark:bg-gray-700"></div>
          </li>
          <li className="w-full">
            <div className="w-full h-8 rounded bg-gray-300 dark:bg-gray-700"></div>
          </li>
          <li className="w-full">
            <div className="w-full h-8 rounded bg-gray-300 dark:bg-gray-700"></div>
          </li>
          <li className="w-full">
            <div className="w-full h-8 rounded bg-gray-300 dark:bg-gray-700"></div>
          </li>
        </ul>

        {/* Video Content Skeleton (using the provided component) */}
        <div className="min-h-[34.2rem] p-4">
          <VideoCardSkeleton />
        </div>
      </div>
    </>
  );
};

export default ChannelSkeleton;
