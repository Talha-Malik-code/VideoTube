import React from "react";

const SearchBar = ({
  placeholder = "Search",
  value = "",
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`relative mb-2 bg-white py-2 pl-8 pr-3 text-black ${className}`}
    >
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>
      <input
        className="w-full bg-transparent outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;
