import React from "react";

const VideoDetailSkeleton = () => {
  return (
    <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap animate-pulse">
      <div className="w-full lg:flex-1">
        {/* Video player skeleton */}
        <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>

        {/* Video info skeleton */}
        <div className="rounded-lg border border-gray-200 dark:border-white/40 p-4 mb-4">
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>

            {/* Actions bar skeleton */}
            <div className="flex gap-4 py-2">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>

            {/* Channel bar skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            </div>

            {/* Description skeleton */}
            <hr className="my-4 border-gray-200 dark:border-white" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="w-full lg:w-[350px] xl:w-[400px] space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex gap-2">
            <div className="w-40 h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetailSkeleton;
