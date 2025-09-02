import React from "react";
import { calculatePlaylistStats } from "../utils/playlistUtils";

const PlaylistStats = ({ playlists = [] }) => {
  const stats = calculatePlaylistStats(playlists);

  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800">
      <div className="text-center">
        <div className="text-2xl font-bold text-[#ae7aff]">
          {stats.totalPlaylists}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Playlists
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-[#ae7aff]">
          {stats.totalVideos}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Videos
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-[#ae7aff]">
          {formatViews(stats.totalViews)}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total Views
        </div>
      </div>
    </div>
  );
};

export default PlaylistStats;
