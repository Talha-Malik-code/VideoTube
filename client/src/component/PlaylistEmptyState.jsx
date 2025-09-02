import React from "react";
import Button from "./Button";
import PlaylistNotFound from "./notFound/PlaylistNotFound";
import PlusIcon from "./iconComponents/PlusIcon";

const PlaylistEmptyState = ({ isMyChannel = false, onCreatePlaylist }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {isMyChannel ? "No playlists yet" : "No playlists found"}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        {isMyChannel
          ? "Start organizing your videos by creating your first playlist. Group related content together for your viewers."
          : "This channel hasn't created any playlists yet. Check back later for organized video collections."}
      </p> */}

      <PlaylistNotFound
        title={isMyChannel ? "No playlists yet" : "No playlists found"}
        text={
          isMyChannel
            ? "Start organizing your videos by creating your first playlist. Group related content together for your viewers."
            : "This channel hasn't created any playlists yet. Check back later for organized video collections."
        }
      />

      {isMyChannel && onCreatePlaylist && (
        <Button
          onClick={onCreatePlaylist}
          className="px-3 py-1.5 font-semibold"
        >
          <div className="flex items-center gap-1">
            <PlusIcon className="font-semibold" />
            Create Your First Playlist
          </div>
        </Button>
      )}
    </div>
  );
};

export default PlaylistEmptyState;
