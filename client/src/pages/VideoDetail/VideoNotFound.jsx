import React from "react";

const VideoNotFound = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </span>
        </p>
        <h5 className="mb-2 font-semibold">Video not found</h5>
        <p>
          This video might have been removed, made private, or the link is
          incorrect. Please check the URL or try searching for other videos.
        </p>
      </div>
    </div>
  );
};

export default VideoNotFound;
