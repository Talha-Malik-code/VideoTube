import React from "react";
import { useLocation } from "react-router-dom";
import HomeIcon from "./iconComponents/HomeIcon";
import ThumbsUpIcon from "./iconComponents/ThumbsUpIcon";
import HistoryIcon from "./iconComponents/HistoryIcon";
import PlayRectangleIcon from "./iconComponents/PlayRectangleIcon";
import CollectionsIcon from "./iconComponents/CollectionsIcon";
import SubscribersIcon from "./iconComponents/SubscribersIcon";
import SupportIcon from "./iconComponents/SupportIcon";
import GearIcon from "./iconComponents/GearIcon";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const location = useLocation();
  const isVideoRoute = location.pathname.startsWith("/video/");

  // ✅ Different positioning for video page vs other pages
  const positioningClass = isVideoRoute
    ? "lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:z-40" // Video page: absolute positioning, full height, behind navbar
    : "lg:sticky"; // Other pages: sticky positioning

  const lgWidthClass = isVideoRoute
    ? "lg:w-[70px] lg:hover:w-[250px] lg:transition-all lg:duration-300"
    : "lg:max-w-[250px]";

  const labelClass = isVideoRoute
    ? "block sm:hidden sm:group-hover:inline"
    : "block sm:hidden sm:group-hover:inline lg:inline";

  return (
    <>
      {/* ✅ Spacer div for video page to reserve 70px space */}
      {isVideoRoute && (
        <div className="hidden lg:block lg:w-[70px] lg:shrink-0" />
      )}

      <aside
        className={`group fixed inset-x-0 bottom-0 z-40 w-full shrink-0 border-t border-gray-300 bg-white text-gray-900 px-2 py-2 dark:border-white dark:bg-[#121212] dark:text-white sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[250px] ${positioningClass} ${lgWidthClass}`}
      >
        <ul className="flex justify-around gap-y-2 sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col">
          <li className="">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:hover:text-black dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <HomeIcon />
              </span>
              <span className={labelClass}>Home</span>
            </button>
          </li>
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:hover:text-black dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <ThumbsUpIcon />
              </span>
              <span className={labelClass}>Liked Videos</span>
            </button>
          </li>
          <li className="">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:hover:text-black dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <HistoryIcon />
              </span>
              <span className={labelClass}>History</span>
            </button>
          </li>
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:hover:text-black dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <PlayRectangleIcon />
              </span>
              <span className={labelClass}>My Content</span>
            </button>
          </li>
          <li className="">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:hover:text-black dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <CollectionsIcon />
              </span>
              <span className={labelClass}>Collections</span>
            </button>
          </li>
          <li className="">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <SubscribersIcon />
              </span>
              <span className={labelClass}>Subscribers</span>
            </button>
          </li>
          <li className="hidden sm:block mt-auto">
            <div className="flex flex-col items-center sm:items-start">
              <ThemeToggle small />
            </div>
          </li>
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center py-1 focus:text-[#5936D9] dark:focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:border-gray-300 sm:p-1.5 sm:hover:bg-gray-100 sm:hover:text-black sm:focus:border-[#5936D9] sm:focus:bg-gray-100 sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 dark:sm:border-white dark:sm:hover:bg-[#ae7aff] dark:sm:hover:text-black dark:sm:focus:border-[#ae7aff] dark:sm:focus:bg-[#ae7aff] dark:sm:focus:text-black">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <SupportIcon />
              </span>
              <span className={labelClass}>Support</span>
            </button>
          </li>
          <li className="hidden sm:block">
            <button className="flex flex-col items-center justify-center border-white py-1 focus:text-[#ae7aff] sm:w-full sm:flex-row sm:border sm:p-1.5 sm:hover:bg-[#ae7aff] sm:hover:text-black sm:focus:border-[#ae7aff] sm:focus:bg-[#ae7aff] dark:sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4">
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <GearIcon />
              </span>
              <span className={labelClass}>Settings</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
