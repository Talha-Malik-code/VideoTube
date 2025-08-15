import React, { useState } from "react";
import ThemeToggle from "../../component/ThemeToggle";
import NoVideo from "./NoVideo";
import CardViewListing from "./CardViewListing/CardViewListing";
import ListViewListing from "./ListViewListing/ListViewListing";

const Home = () => {
  const [viewMode, setViewMode] = useState("card"); // "list" or "card"

  return (
    <>
      {/* View Toggle Controls */}
      <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-white/40">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded ${
            viewMode === "list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("card")}
          className={`px-4 py-2 rounded ${
            viewMode === "card"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Card View
        </button>
      </div>

      {/* Render based on view mode */}
      {viewMode === "list" ? <ListViewListing /> : <CardViewListing />}
    </>
  );
};

export default Home;
