import React from "react";

const VideoDetails = ({ viewsText, timeText, className = "" }) => {
  return (
    <p className={`flex text-sm text-gray-600 dark:text-gray-200 ${className}`}>
      {viewsText} · {timeText}
    </p>
  );
};

export default VideoDetails;
