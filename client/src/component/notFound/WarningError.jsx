import React from "react";

const WarningError = ({
  title = "Something went wrong",
  text = "Something went wrong. Please try again later.",
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
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4c.45 0 .9.25 1.2.7l8 14c.4.7-.1 1.55-.95 1.55H3.75c-.85 0-1.35-.85-.95-1.55l8-14c.3-.45.75-.7 1.2-.7z"
              />
              <line
                x1="12"
                y1="9"
                x2="12"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16.5" r="1.1" fill="currentColor" />
            </svg>
          </span>
        </p>
        <h5 className="mb-2 font-semibold">{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default WarningError;
