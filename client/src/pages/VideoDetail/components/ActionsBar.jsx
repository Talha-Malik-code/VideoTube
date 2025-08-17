import React from "react";
import LikeIcon from "../../../component/iconComponents/LikeIcon";
import BoostIcon from "../../../component/iconComponents/BoostIcon";
import SaveIcon from "../../../component/iconComponents/SaveIcon";

const ActionsBar = ({
  likeCount,
  boostCount,
  isLiked,
  isLiking,
  onLikeToggle,
}) => {
  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
        <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
          <button
            onClick={onLikeToggle}
            disabled={isLiking}
            className={`flex items-center gap-x-2 border-r border-gray-300 px-4 py-1.5 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 transition-all ${
              isLiked ? "bg-blue-50 dark:bg-blue-900/20" : ""
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block w-5 ${
                isLiked ? "text-[#5936D9] dark:text-[#ae7aff]" : ""
              }`}
            >
              <LikeIcon filled={isLiked} />
            </span>
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          <button className="flex items-center gap-x-2 px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
            <span className="inline-block w-5">
              <BoostIcon />
            </span>
            <span className="text-sm font-medium">{boostCount}</span>
          </button>
        </div>

        <div className="relative block">
          <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black dark:bg-white dark:text-black">
            <span className="inline-block w-5">
              <SaveIcon />
            </span>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionsBar;
