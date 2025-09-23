import React from "react";
import { getPlaylistThumbnail } from "../../../utils/playlistUtils";
import { useNavigate } from "react-router-dom";

const PlaylistHero = ({ playlist }) => {
  const navigate = useNavigate();
  const thumbnail = getPlaylistThumbnail(playlist);
  const goToChannel = () => navigate(`/channel/${playlist?.owner?.username}`);

  // Calculate total views from videos
  const totalViews = playlist?.videos?.reduce(
    (sum, video) => sum + (video.views || 0),
    0
  );

  // Format creation time
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4)
      return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12)
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  };

  // Format views count
  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <>
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          <img src={thumbnail} alt={playlist.name} className="h-full w-full" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
              <div className="relative z-[1]">
                <p className="flex justify-between">
                  <span className="inline-block">Playlist</span>
                  <span className="inline-block">12&nbsp;videos</span>
                </p>
                <p className="text-sm text-gray-200">
                  {formatViews(totalViews)} Views&nbsp;·&nbsp;
                  {formatTimeAgo(playlist?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h6 className="mb-1 font-semibold text-black dark:text-white">
        {playlist.name}
      </h6>
      <p className="flex text-sm text-gray-600 dark:text-gray-200">
        {playlist.description}
      </p>
      <div
        onClick={goToChannel}
        className="mt-6 flex items-center gap-x-3 cursor-pointer"
      >
        <div className="h-16 w-16 shrink-0">
          <img
            src={playlist.owner.avatar}
            alt={playlist.owner.fullName}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="w-full">
          <h6 className="font-semibold text-black dark:text-white">
            {playlist.owner.fullName}
          </h6>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            757K Subscribers
          </p>
        </div>
      </div>
    </>
  );
};

export default PlaylistHero;
