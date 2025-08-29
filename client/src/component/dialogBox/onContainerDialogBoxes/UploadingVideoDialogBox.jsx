import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsUploading,
  selectLastUploadedVideo,
} from "../../../app/features/videoSlice";
import { closeDialog } from "../../../app/features/dialogToggleSlice";
import { X } from "lucide-react";
import XIcon from "../../iconComponents/XIcon";
import VideoFileIcon from "../../iconComponents/VideoFileIcon";
import ALoadingIcon from "../../iconComponents/ALoadingIcon";
import RoundTickIcon from "../../iconComponents/RoundTickIcon";
import { addUploadedVideo } from "../../../app/features/channelSlice";

const UploadingVideoDialogBox = ({ videoName, videoSize }) => {
  const dispatch = useDispatch();
  const isUploading = useSelector(selectIsUploading);
  const lastUploadedVideo = useSelector(selectLastUploadedVideo);

  function closeUploadingDialog() {
    dispatch(closeDialog("uploadVideo"));
    if (!isUploading && lastUploadedVideo) {
      console.log(lastUploadedVideo);
      dispatch(addUploadedVideo(lastUploadedVideo));
    }
  }

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-[calc(100vh-66px)] items-center justify-center bg-black/50 px-4 pb-[86px] pt-4 sm:h-[calc(100vh-82px)] sm:px-14 sm:py-8">
      <div className="w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold">
            {isUploading ? "Uploading Video..." : "Uploaded Video"}
            <span className="block text-sm text-gray-300">
              Track your video uploading process.
            </span>
          </h2>
          <button onClick={closeUploadingDialog} className="h-6 w-6">
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
            <h6>{videoName}</h6>
            <p className="text-sm">{formatFileSize(videoSize)}</p>
            {isUploading ? (
              <div className="mt-2">
                <ALoadingIcon />
                Uploading...
              </div>
            ) : (
              <div className="mt-2 flex items-center">
                <RoundTickIcon />
                Uploaded Successfully
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="border px-4 py-3">Cancel</button>
          <button
            className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]"
            disabled={isUploading}
            onClick={closeUploadingDialog}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default UploadingVideoDialogBox;
