import React, { useState } from "react";
import { useDispatch } from "react-redux";
import AButton from "../../../component/AButton";
import {
  updatePlaylistDetails,
  removeVideoFromPlaylistThunk,
} from "../../../app/features/playlistSlice";
import { updateChannelPlaylistCacheData } from "../../../app/features/channelSlice";

const EditPlaylistDialog = ({ playlist, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(playlist?.name || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [thumbnailFile, setThumbnailFile] = useState(null);

  async function handleSave() {
    const payload = { playlistId: playlist._id };
    if (name !== playlist.name) payload.name = name;
    if (description !== playlist.description) payload.description = description;
    if (thumbnailFile) payload.thumbnail = thumbnailFile; // send File via FormData in thunk
    const result = await dispatch(updatePlaylistDetails(payload));
    if (result.meta.requestStatus === "fulfilled") {
      // Pass the updated playlist data from the API response
      dispatch(updateChannelPlaylistCacheData(result.payload));
    }
    onClose?.();
  }

  function handleRemoveVideo(videoId) {
    dispatch(
      removeVideoFromPlaylistThunk({ playlistId: playlist._id, videoId })
    );
  }

  return (
    <div className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8">
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full overflow-auto border bg-white dark:bg-[#121212]"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Edit Playlist
          </h2>
          <div className="flex gap-2">
            <AButton onClick={onClose}>Cancel</AButton>
            <AButton onClick={handleSave}>Save</AButton>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
          <div className="w-full">
            <label
              htmlFor="thumbnail"
              className="mb-1 inline-block text-black dark:text-white"
            >
              Thumbnail
            </label>
            <input
              id="thumbnail"
              type="file"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="w-full cursor-pointer border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="name"
              className="mb-1 inline-block text-black dark:text-white"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border bg-transparent px-2 py-1 outline-none text-black dark:text-white"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="desc"
              className="mb-1 inline-block text-black dark:text-white"
            >
              Description
            </label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none text-black dark:text-white"
            />
          </div>

          <div className="w-full">
            <h3 className="mb-2 font-semibold text-black dark:text-white">
              Videos
            </h3>
            <div className="flex flex-col gap-3">
              {playlist?.videos?.map((v) => (
                <div
                  key={v._id}
                  className="flex items-center justify-between border p-2 dark:bg-transparent bg-white"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={v.thumbnail?.url || v.thumbnail || ""}
                      alt={v.title}
                      className="h-12 w-20 object-cover"
                    />
                    <span className="text-sm text-black dark:text-white">
                      {v.title}
                    </span>
                  </div>
                  <AButton onClick={() => handleRemoveVideo(v._id)}>
                    Remove
                  </AButton>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistDialog;
