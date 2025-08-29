import React, { useState } from "react";
import AButton from "../../AButton";
import UploadIcon from "../../iconComponents/UploadIcon";
import { useDispatch } from "react-redux";
import { closeDialog } from "../../../app/features/dialogToggleSlice";
import { validateUploadVideoForm } from "../../../../utils/validateVideoUploadForm";
import { uploadVideo } from "../../../app/features/videoSlice";
import { X } from "lucide-react";
import UploadingVideoDialogBox from "./UploadingVideoDialogBox.jsx";

const UploadVideoDialogBox = () => {
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreviewURL, setVideoPreviewURL] = useState(null);
  const [errors, setErrors] = useState();
  const [details, setDetails] = useState({
    title: "",
    description: "",
  });
  const [startUploading, setStartUploading] = useState(false);

  function handleClickSave() {
    const validationErrors = validateUploadVideoForm(
      { videoFile, thumbnailFile },
      details
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("title", details.title);
      formData.append("description", details.description);
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnailFile);

      dispatch(uploadVideo(formData));
      setStartUploading(true);
    }
  }

  function closeThisDialog() {
    dispatch(closeDialog("uploadVideo"));
  }

  function handleSelectVideo(e) {
    console.log(e.target.files[0]);
    setVideoFile(e.target.files[0]);
    setErrors({
      ...errors,
      videoFile: null,
    });
    setVideoPreviewURL(URL.createObjectURL(e.target.files[0]));
  }

  function handleSelectThumbnail(e) {
    setThumbnailFile(e.target.files[0]);
    setErrors({
      ...errors,
      thumbnailFile: null,
    });
  }

  function handleChangeTitle(e) {
    setDetails({
      ...details,
      title: e.target.value,
    });

    setErrors({
      ...errors,
      title: null,
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

  function handleRemoveVideo() {
    setVideoFile(null);
    setVideoPreviewURL(null);
  }

  if (startUploading) {
    return (
      <UploadingVideoDialogBox
        videoName={videoFile?.name}
        videoSize={videoFile?.size}
      />
    );
  }

  return (
    <div
      onClick={closeThisDialog}
      className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full overflow-auto border bg-[#121212]"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Upload Videos</h2>
          <AButton onClick={handleClickSave}>Save</AButton>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
          <div className="w-full border-2 border-dashed px-4 py-12 text-center">
            {videoPreviewURL && (
              <div className="w-full flex justify-end mb-2">
                <X onClick={handleRemoveVideo} className="cursor-pointer" />
              </div>
            )}
            {videoPreviewURL ? (
              <div className="w-full">
                <video className="h-full w-full" controls autoPlay>
                  <source src={videoPreviewURL} type="video/mp4" />
                </video>
              </div>
            ) : (
              <>
                <span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
                  <UploadIcon />
                </span>
                <h6 className="mb-2 font-semibold">
                  Drag and drop video files to upload
                </h6>
                <p className="text-gray-400">
                  Your videos will be private untill you publish them.
                </p>
                {errors?.videoFile && (
                  <p className="text-red-500">*{errors.videoFile}</p>
                )}
                <label
                  htmlFor="upload-video"
                  className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
                >
                  <input
                    onChange={handleSelectVideo}
                    type="file"
                    accept="video/mp4, video/webm, video/ogg, .mp4, .webm, .mkv, .ts"
                    id="upload-video"
                    className="sr-only"
                  />
                  Select Files
                </label>
              </>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="thumbnail" className="mb-1 inline-block">
              Thumbnail
              <sup>*</sup>
            </label>
            <input
              onChange={handleSelectThumbnail}
              id="thumbnail"
              type="file"
              className="w-full cursor-pointer border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5"
            />
            {errors?.thumbnailFile && (
              <p className="text-red-500">*{errors.thumbnailFile}</p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="title" className="mb-1 inline-block">
              Title
              <sup>*</sup>
            </label>
            <input
              value={details.title}
              onChange={handleChangeTitle}
              id="title"
              type="text"
              className="w-full border bg-transparent px-2 py-1 outline-none"
            />
            {errors?.title && <p className="text-red-500">*{errors.title}</p>}
          </div>
          <div className="w-full">
            <label htmlFor="desc" className="mb-1 inline-block">
              Description
              <sup>*</sup>
            </label>
            <textarea
              value={details.description}
              onChange={handleChangeDescription}
              id="desc"
              className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
            />
            {errors?.description && (
              <p className="text-red-500">*{errors.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoDialogBox;
