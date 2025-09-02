import React from "react";
import PlaylistCard from "./PlaylistCard";
import { sortPlaylists } from "../utils/playlistUtils";

const PlaylistGrid = ({
  playlists = [],
  isLoading = false,
  error = null,
  sortBy = "newest",
}) => {
  const sortedPlaylists = sortPlaylists(playlists, sortBy);
  if (isLoading) {
    return (
      <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-full animate-pulse">
            <div className="relative mb-2 w-full pt-[56%] bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-500 text-lg mb-2">Error loading playlists</div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">{error}</div>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          No playlists found
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-sm">
          This channel hasn't created any playlists yet.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
      {sortedPlaylists.map((playlist) => (
        <PlaylistCard key={playlist._id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistGrid;
