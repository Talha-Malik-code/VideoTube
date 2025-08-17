import React from "react";

const VideoPlayer = ({ src }) => {
  let videoSrc = src;
  if (src.split(".").pop() === "ts") {
    videoSrc = src.replace(".ts", ".webm");
  }

  return (
    <div className="relative mb-4 w-full pt-[56%]">
      <div className="absolute inset-0">
        <video className="h-full w-full" controls autoPlay muted>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
