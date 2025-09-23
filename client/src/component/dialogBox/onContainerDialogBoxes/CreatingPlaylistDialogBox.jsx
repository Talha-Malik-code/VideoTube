import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../../app/features/dialogToggleSlice";
import XIcon from "../../iconComponents/XIcon";
import VideoFileIcon from "../../iconComponents/VideoFileIcon";
import ALoadingIcon from "../../iconComponents/ALoadingIcon";
import RoundTickIcon from "../../iconComponents/RoundTickIcon";
import { selectIsCreatingChannelPlaylist } from "../../../app/features/channelSlice";

const CreatingPlaylistDialogBox = ({ playlistName }) => {
  const dispatch = useDispatch();
  const isCreatingPlaylist = useSelector(selectIsCreatingChannelPlaylist);

  function closeCreatingDialog() {
    dispatch(closeDialog("createPlaylist"));
  }

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
      <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-white dark:bg-[#121212] p-4">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            {isCreatingPlaylist ? "Creating Playlist..." : "Created Playlist"}
            <span className="block text-sm text-gray-600 dark:text-gray-300">
              Track your playlist creation process.
            </span>
          </h2>
          <button onClick={closeCreatingDialog} className="h-6 w-6">
            <XIcon />
          </button>
        </div>
        <div className="mb-6 flex gap-x-2 border p-3">
          <div className="w-8 shrink-0">
            <span className="inline-block w-full rounded-full bg-[#E4D3FF] p-1 text-[#AE7AFF]">
              <VideoFileIcon />
            </span>
          </div>
          <div className="flex flex-col">
            <h6 className="text-black dark:text-white">{playlistName}</h6>
            {isCreatingPlaylist ? (
              <div className="mt-2 text-black dark:text-white">
                <ALoadingIcon />
                Creating...
              </div>
            ) : (
              <div className="mt-2 flex items-center text-black dark:text-white">
                <RoundTickIcon />
                Created Successfully
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="border px-4 py-3 text-black dark:text-white"
            onClick={closeCreatingDialog}
          >
            Cancel
          </button>
          <button
            className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"
            disabled={isCreatingPlaylist}
            onClick={closeCreatingDialog}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatingPlaylistDialogBox;
