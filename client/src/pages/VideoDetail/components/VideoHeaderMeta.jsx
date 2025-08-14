import React from "react";

const VideoHeaderMeta = ({ title, viewsText, timeText }) => {
  return (
    <div className="flex flex-wrap gap-y-2">
      <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="flex text-sm text-gray-600 dark:text-gray-200">
          {viewsText} · {timeText}
        </p>
      </div>
    </div>
  );
};

export default VideoHeaderMeta;
