import React from "react";
import { Link } from "react-router-dom";

const normalOptions = [
  {
    id: "videos",
    title: "Videos",
  },
  {
    id: "playlists",
    title: "Playlist",
  },
  {
    id: "tweets",
    title: "Tweets",
  },
  {
    id: "subscribed",
    title: "Subscribed",
  },
];

const editProfileOptions = [
  {
    id: "edit_personal",
    title: "Personal Information",
  },
  {
    id: "edit_channel",
    title: "Channel Information",
  },
  {
    id: "change_password",
    title: "Change Password",
  },
];

const ToggleBarSection = ({ username, isEditable = false, subpage }) => {
  const options = isEditable ? editProfileOptions : normalOptions;
  const startingUrl = isEditable
    ? `/channel/${username}?edit=true&`
    : `/channel/${username}?`;

  const activeSubpage = options.find((option) => option.id === subpage)
    ? subpage
    : options[0].id;

  return (
    <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-200 bg-white py-2 dark:border-gray-400 dark:bg-[#121212] sm:top-[82px]">
      {options.map((option) => (
        <li key={option.id} className="w-full">
          <Link to={`${startingUrl}subpage=${option.id}`}>
            <button
              className={
                activeSubpage === option.id
                  ? "w-full border-b-2 border-[#ae7aff] bg-[#f0f0f0] px-3 py-1.5 text-black dark:bg-white dark:text-[#ae7aff]"
                  : "w-full border-b-2 border-transparent px-3 py-1.5 text-gray-600 dark:text-gray-400"
              }
            >
              {option.title}
            </button>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ToggleBarSection;
