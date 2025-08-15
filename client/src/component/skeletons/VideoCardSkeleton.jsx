import React from "react";

const VideoCardSkeleton = ({ count = 8 }) => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="w-full text-gray-800 dark:text-white animate-pulse"
          >
            {/* Thumbnail skeleton - matches CardVideo structure */}
            <div className="relative mb-2 w-full pt-[56%]">
              <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Content skeleton - matches CardVideo layout */}
            <div className="flex gap-x-2">
              {/* Avatar skeleton - matches ChannelAvatar size={40} */}
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0"></div>

              {/* Text content skeleton */}
              <div className="w-full space-y-1">
                {/* Video title skeleton */}
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-1"></div>
                {/* Video details skeleton */}
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                {/* Channel name skeleton */}
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoCardSkeleton;
