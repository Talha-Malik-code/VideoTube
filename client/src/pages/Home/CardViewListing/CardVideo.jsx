import React from "react";
import { useNavigate } from "react-router-dom";
import VideoTitle from "../videoComponents/VideoTitle";
import VideoDetails from "../videoComponents/VideoDetails";
import ChannelAvatar from "../videoComponents/ChannelAvatar";

const CardVideo = ({
  thumbnailUrl,
  duration,
  avatarUrl,
  channelName,
  title,
  viewsText,
  timeText,
  id,
}) => {
  const navigate = useNavigate();
  const goToVideo = () => navigate(`/video/${id || encodeURIComponent(title)}`);
  return (
    <div
      className="w-full text-gray-800 dark:text-white"
      role="button"
      onClick={goToVideo}
    >
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        {duration ? (
          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
            {duration}
          </span>
        ) : null}
      </div>
      <div className="flex gap-x-2">
        <ChannelAvatar src={avatarUrl} alt={channelName} size={40} />
        <div className="w-full">
          <VideoTitle title={title} className="mb-1" />
          <VideoDetails viewsText={viewsText} timeText={timeText} />
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {channelName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardVideo;
