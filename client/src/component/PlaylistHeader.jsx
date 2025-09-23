import React from "react";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { openDialog } from "../app/features/dialogToggleSlice";

const PlaylistHeader = ({
  channelName,
  totalPlaylists = 0,
  isMyChannel = false,
}) => {
  const dispatch = useDispatch();

  function onCreatePlaylist() {
    dispatch(openDialog("createPlaylist"));
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {isMyChannel ? "My Playlists" : `${channelName}'s Playlists`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalPlaylists} playlist{totalPlaylists !== 1 ? "s" : ""}
          </p>
        </div>

        {isMyChannel && (
          <Button onClick={onCreatePlaylist} className="px-3 py-1.5">
            Create Playlist
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700"></div>
    </div>
  );
};

export default PlaylistHeader;
