import React from "react";

const VideoTitle = ({ title, className = "" }) => {
  return <h6 className={`font-semibold ${className}`}>{title}</h6>;
};

export default VideoTitle;
