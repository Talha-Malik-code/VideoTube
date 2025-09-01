import React from "react";

const NoInternetConnection = ({
  title = "No internet connection",
  text = "Please check your internet connection and try again.",
}) => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25a15.72 15.72 0 0119.5 0"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 12a10.47 10.47 0 0113.5 0"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15.75a5.22 5.22 0 017.5 0"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v.01"
              />
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="w-6"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              <path
                d="M3 12a15 15 0 0118 0M6 7.5a15 15 0 0112 0M6 16.5a15 15 0 0112 0"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
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

export default NoInternetConnection;
