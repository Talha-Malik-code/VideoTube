import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoTitle from "../videoComponents/VideoTitle";
import VideoDetails from "../videoComponents/VideoDetails";
import ChannelAvatar from "../videoComponents/ChannelAvatar";

const CardVideo = ({
  thumbnail,
  duration,
  owner,
  title,
  createdAt,
  views,
  _id,
}) => {
  const navigate = useNavigate();
  const goToVideo = () =>
    navigate(`/video/${_id || encodeURIComponent(title)}`);
  const goToChannel = () => navigate(`/channel/${owner.username}`);

  // check if the user is on channel page
  const isChannelPage = useLocation().pathname.includes("/channel/");

  function handleChannelClick(e) {
    e.stopPropagation();
    goToChannel();
  }

  return (
    <div
      className="w-full text-gray-800 dark:text-white"
      role="button"
      onClick={goToVideo}
    >
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <img
            src={thumbnail}
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
        {!isChannelPage && (
          <ChannelAvatar
            onClick={handleChannelClick}
            src={owner.avatar}
            alt={owner.fullName}
            size={40}
          />
        )}
        <div className="w-full">
          <VideoTitle title={title} className="mb-1" />
          {!isChannelPage && (
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {owner.fullName}
            </p>
          )}
          <VideoDetails createdAt={createdAt} views={views} />
        </div>
      </div>
    </div>
  );
};

export default CardVideo;
