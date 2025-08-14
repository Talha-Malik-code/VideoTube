import React from "react";
import LikeIcon from "../../../component/iconComponents/LikeIcon";
import BoostIcon from "../../../component/iconComponents/BoostIcon";
import SaveIcon from "../../../component/iconComponents/SaveIcon";

const ActionsBar = ({ likeCount, boostCount }) => {
  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
        <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
          <button
            className="group/btn flex items-center gap-x-2 border-r border-gray-300 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-gray-100 focus:after:content-[attr(data-like-alt)] dark:border-gray-700 dark:hover:bg-white/10"
            data-like={likeCount}
            data-like-alt={likeCount + 1}
          >
            <span className="inline-block w-5 group-focus/btn:text-[#5936D9] dark:group-focus/btn:text-[#ae7aff]">
              <LikeIcon />
            </span>
          </button>
          <button
            className="group/btn flex items-center gap-x-2 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-gray-100 focus:after:content-[attr(data-like-alt)] dark:hover:bg-white/10"
            data-like={boostCount}
            data-like-alt={boostCount + 1}
          >
            <span className="inline-block w-5 group-focus/btn:text-[#5936D9] dark:group-focus/btn:text-[#ae7aff]">
              <BoostIcon />
            </span>
          </button>
        </div>

        <div className="relative block">
          <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black dark:bg-white dark:text-black">
            <span className="inline-block w-5">
              <SaveIcon />
            </span>
            Save
          </button>
          {/* Save dropdown - simplified as static for now */}
        </div>
      </div>
    </div>
  );
};

export default ActionsBar;
