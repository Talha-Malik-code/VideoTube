import React, { useState } from "react";
import AButton from "../../AButton";
import { useDispatch } from "react-redux";
import { closeDialog } from "../../../app/features/dialogToggleSlice";
import { X } from "lucide-react";
import { createChannelPlaylist } from "../../../app/features/channelSlice";
import CreatingPlaylistDialogBox from "./CreatingPlaylistDialogBox";

const CreatePlaylistDialogBox = () => {
  const dispatch = useDispatch();

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreviewURL, setThumbnailPreviewURL] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    description: "",
  });

  function handleClickSave() {
    const validationErrors = {};
    if (!details.name?.trim()) validationErrors.name = "Name is required";
    if (!details.description?.trim())
      validationErrors.description = "Description is required";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // TODO: Wire to create playlist action when available
      const formData = new FormData();
      formData.append("name", details.name);
      formData.append("description", details.description);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      dispatch(createChannelPlaylist(formData));

      setIsCreatingPlaylist(true);
    }
  }

  function closeThisDialog() {
    dispatch(closeDialog("createPlaylist"));
  }

  function handleSelectThumbnail(e) {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
    if (file) setThumbnailPreviewURL(URL.createObjectURL(file));
    setErrors({
      ...errors,
      thumbnailFile: null,
    });
  }

  function handleChangeName(e) {
    setDetails({
      ...details,
      name: e.target.value,
    });
    setErrors({
      ...errors,
      name: null,
    });
  }

  function handleChangeDescription(e) {
    setDetails({
      ...details,
      description: e.target.value,
    });
    setErrors({
      ...errors,
      description: null,
    });
  }

  function handleRemoveThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreviewURL(null);
  }

  if (isCreatingPlaylist) {
    return <CreatingPlaylistDialogBox playlistName={details.name} />;
  }

  return (
    <div
      onClick={closeThisDialog}
      className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full max-h-[818px] overflow-auto border bg-white dark:bg-[#121212]"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Create Playlist
          </h2>
          <AButton onClick={handleClickSave}>Save</AButton>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
          <div className="w-full">
            <label
              htmlFor="name"
              className="mb-1 inline-block text-black dark:text-white"
            >
              Name
              <sup>*</sup>
            </label>
            <input
              value={details.name}
              onChange={handleChangeName}
              id="name"
              type="text"
              className="w-full border bg-transparent px-2 py-1 outline-none text-black dark:text-white"
              placeholder="My playlist"
            />
            {errors?.name && <p className="text-red-500">*{errors.name}</p>}
          </div>

          <div className="w-full">
            <label
              htmlFor="desc"
              className="mb-1 inline-block text-black dark:text-white"
            >
              Description
              <sup>*</sup>
            </label>
            <textarea
              value={details.description}
              onChange={handleChangeDescription}
              id="desc"
              className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none text-black dark:text-white"
              placeholder="What is this playlist about?"
            />
            {errors?.description && (
              <p className="text-red-500">*{errors.description}</p>
            )}
          </div>

          <div className="w-full border-2 border-dashed px-4 py-8 text-center">
            {thumbnailPreviewURL && (
              <div className="w-full flex justify-end mb-2">
                <X onClick={handleRemoveThumbnail} className="cursor-pointer" />
              </div>
            )}
            {thumbnailPreviewURL ? (
              <div className="w-full">
                <img
                  src={thumbnailPreviewURL}
                  alt="Thumbnail preview"
                  className="h-48 w-full object-contain"
                />
              </div>
            ) : (
              <>
                <h6 className="mb-2 font-semibold text-black dark:text-white">
                  Optional thumbnail
                </h6>
                {errors?.thumbnailFile && (
                  <p className="text-red-500">*{errors.thumbnailFile}</p>
                )}
                <AButton>
                  <label htmlFor="upload-thumbnail">
                    <input
                      onChange={handleSelectThumbnail}
                      type="file"
                      accept="image/*"
                      id="upload-thumbnail"
                      className="sr-only"
                    />
                    Select Thumbnail
                  </label>
                </AButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistDialogBox;
