import React from "react";

const VideoPlayer = ({ src }) => {
  return (
    <div className="relative mb-4 w-full pt-[56%]">
      <div className="absolute inset-0">
        <video className="h-full w-full" controls autoPlay muted>
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
