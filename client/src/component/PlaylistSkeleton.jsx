import React from "react";

const PlaylistSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="w-full animate-pulse">
          <div className="relative mb-2 w-full pt-[56%] bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistSkeleton;
