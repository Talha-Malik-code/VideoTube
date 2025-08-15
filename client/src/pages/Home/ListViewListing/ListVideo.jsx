import React from "react";
import { useNavigate } from "react-router-dom";
import VideoTitle from "../videoComponents/VideoTitle";
import VideoDetails from "../videoComponents/VideoDetails";
import ChannelAvatar from "../videoComponents/ChannelAvatar";

const ListVideo = ({
  thumbnail,
  duration,
  description,
  owner,
  title,
  createdAt,
  views,
  _id,
}) => {
  const navigate = useNavigate();
  const goToVideo = () =>
    navigate(`/video/${_id || encodeURIComponent(title)}`);
  return (
    <div
      className="w-full max-w-3xl gap-x-4 md:flex text-gray-800 dark:text-white"
      role="button"
      onClick={goToVideo}
    >
      <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
        <div className="w-full pt-[56%]">
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
      </div>
      <div className="flex gap-x-2 md:w-7/12">
        <ChannelAvatar
          src={owner.avatar}
          alt={owner.fullName}
          size={40}
          className="md:hidden mt-0.5"
        />
        <div className="w-full">
          <VideoTitle title={title} className="mb-1 md:max-w-[75%]" />
          <VideoDetails
            createdAt={createdAt}
            views={views}
            className="sm:mt-3"
          />
          <div className="flex items-center gap-x-4">
            <ChannelAvatar
              src={owner.avatar}
              alt={owner.fullName}
              size={40}
              className="mt-2 hidden md:block"
            />
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {owner.fullName}
            </p>
          </div>
          {description ? (
            <p className="mt-2 hidden text-sm text-gray-700 dark:text-gray-300 md:block">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListVideo;
