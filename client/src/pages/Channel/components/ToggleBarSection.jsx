import React from "react";

const ToggleBarSection = () => {
  return (
    <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-200 bg-white py-2 dark:border-gray-400 dark:bg-[#121212] sm:top-[82px]">
      <li className="w-full">
        <button className="w-full border-b-2 border-[#ae7aff] bg-[#f0f0f0] px-3 py-1.5 text-black dark:bg-white dark:text-[#ae7aff]">
          Videos
        </button>
      </li>
      <li className="w-full">
        <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-600 dark:text-gray-400">
          Playlist
        </button>
      </li>
      <li className="w-full">
        <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-600 dark:text-gray-400">
          Tweets
        </button>
      </li>
      <li className="w-full">
        <button className="w-full border-b-2 border-transparent px-3 py-1.5 text-gray-600 dark:text-gray-400">
          Subscribed
        </button>
      </li>
    </ul>
  );
};

export default ToggleBarSection;
