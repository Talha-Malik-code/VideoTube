import React from "react";

const shimmer = "animate-pulse bg-gray-200 dark:bg-gray-700";

const PlaylistSkeleton = ({ items = 6 }) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
      <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
        <div className="relative mb-2 w-full pt-[56%]">
          <div className={`absolute inset-0 ${shimmer}`} />
        </div>
        <div className={`h-5 w-40 mb-2 ${shimmer}`} />
        <div className={`h-4 w-72 ${shimmer}`} />
        <div className="mt-6 flex items-center gap-x-3">
          <div className={`h-16 w-16 shrink-0 rounded-full ${shimmer}`} />
          <div className="w-full">
            <div className={`h-4 w-40 mb-2 ${shimmer}`} />
            <div className={`h-3 w-28 ${shimmer}`} />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-4">
        {Array.from({ length: items }).map((_, idx) => (
          <div key={idx} className="border dark:bg-transparent bg-white">
            <div className="w-full max-w-3xl gap-x-4 sm:flex">
              <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
                <div className="w-full pt-[56%]">
                  <div className={`absolute inset-0 ${shimmer}`} />
                  <span
                    className={`absolute bottom-1 right-1 h-4 w-14 rounded ${shimmer}`}
                  />
                </div>
              </div>
              <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
                <div
                  className={`h-10 w-10 shrink-0 sm:hidden rounded-full ${shimmer}`}
                />
                <div className="w-full">
                  <div className={`h-5 w-3/4 mb-2 ${shimmer}`} />
                  <div className={`h-4 w-1/2 mb-2 ${shimmer}`} />
                  <div className="flex items-center gap-x-4">
                    <div
                      className={`mt-2 hidden h-10 w-10 shrink-0 sm:block rounded-full ${shimmer}`}
                    />
                    <div className={`h-4 w-28 ${shimmer}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSkeleton;
