import React from "react";

const NoVideo = ({
  title = "No videos available",
  text = "There are no videos here available. Please try to search some thing else.",
}) => {
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
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          </span>
        </p>
        <h5 className="mb-2 font-semibold">{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default NoVideo;
