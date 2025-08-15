import React from "react";

const VideoListSkeleton = ({ count = 5 }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full max-w-3xl gap-x-4 md:flex animate-pulse"
        >
          {/* Thumbnail skeleton */}
          <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
            <div className="w-full pt-[56%]">
              <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex gap-x-2 md:w-7/12">
            {/* Avatar skeleton */}
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0"></div>

            {/* Text content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoListSkeleton;
