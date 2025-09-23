import React from "react";
import { useNavigate } from "react-router-dom";

const PlaylistVideoItem = ({ video }) => {
  const navigate = useNavigate();
  const views = video.views;
  const goToChannel = () => navigate(`/channel/${video?.owner?.username}`);
  const goToVideo = () => navigate(`/video/${video?._id}`);

  const date = new Date(video.createdAt);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  let timeText = "";
  if (diffDays > 0) {
    timeText = `${diffDays} days ago`;
  } else if (diffHours > 0) {
    timeText = `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    timeText = `${diffMinutes} minutes ago`;
  } else {
    timeText = "Just now";
  }

  let viewsText = "";
  if (views > 1000) {
    viewsText = `${(views / 1000).toFixed(1)}k`;
  } else {
    viewsText = views.toString();
  }

  return (
    <div onClick={goToVideo} className="w-full max-w-3xl gap-x-4 sm:flex">
      <div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
        <div className="w-full pt-[56%]">
          <div className="absolute inset-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full"
            />
          </div>
          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
            {video.duration}
          </span>
        </div>
      </div>
      <div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
        <div className="h-10 w-10 shrink-0 sm:hidden">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h6 className="mb-1 font-semibold sm:max-w-[75%] text-black dark:text-white hover:text-[#5936D9] dark:hover:text-[#ae7aff] transition-colors cursor-pointer">
            {video.title}
          </h6>
          <p className="flex text-sm text-gray-600 dark:text-gray-200 sm:mt-3">
            {viewsText} views · {timeText}
          </p>
          <div
            onClick={(e) => {
              e.stopPropagation();
              goToChannel();
            }}
            className="flex items-center gap-x-4 cursor-pointer"
          >
            <div className="mt-2 hidden h-10 w-10 shrink-0 sm:block">
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="h-full w-full rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-200">
              {video.owner.fullName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistVideoItem;
