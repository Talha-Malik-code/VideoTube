import React from "react";
import LikeIcon from "../../../component/iconComponents/LikeIcon";
import BoostIcon from "../../../component/iconComponents/BoostIcon";
import SaveIcon from "../../../component/iconComponents/SaveIcon";

const ActionsBar = ({
  likeCount,
  isLiked,
  isLiking,
  onLikeToggle,
  onDislikeToggle,
  isDisliked,
  isDisliking,
  dislikeCount,
  videoURL,
  videoTitle,
}) => {
  let videoSrc = videoURL;
  if (videoURL.split(".").pop() === "ts") {
    videoSrc = videoURL.replace(".ts", ".mkv").replace("http", "https");
  }

  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
        <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
          <button
            onClick={onLikeToggle}
            disabled={isLiking || isDisliking}
            className={`flex items-center gap-x-2 border-r border-gray-300 px-4 py-1.5 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 transition-all ${
              isLiked ? "bg-blue-50 dark:bg-blue-900/20" : ""
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block w-5 ${
                isLiked ? "text-[#5936D9] dark:text-[#ae7aff]" : ""
              }`}
            >
              <LikeIcon
              // filled={isLiked}
              />
            </span>
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          <button
            onClick={onDislikeToggle}
            disabled={isLiking || isDisliking}
            className={`flex items-center gap-x-2 px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all ${
              isDisliked ? "bg-red-50 dark:bg-red-900/20" : ""
            } ${isDisliking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block w-5 ${
                isDisliked ? "text-[#5936D9] dark:text-[#ae7aff]" : ""
              }`}
            >
              <BoostIcon
              // filled={isDisliked}
              />
            </span>
            <span className="text-sm font-medium">{dislikeCount}</span>
          </button>
        </div>

        <div className="relative block">
          <a href={videoSrc} download={videoTitle}>
            <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black dark:bg-white dark:text-black">
              <span className="inline-block w-5">
                <SaveIcon />
              </span>
              Save
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActionsBar;
