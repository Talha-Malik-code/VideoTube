import React from "react";

const PlaylistFilter = ({
  sortBy = "newest",
  onSortChange,
  showStats = true,
  onToggleStats,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ae7aff]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="videos">Most Videos</option>
            <option value="views">Most Views</option>
          </select>
        </div>

        {showStats !== undefined && (
          <button
            onClick={onToggleStats}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {showStats ? "Hide Stats" : "Show Stats"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistFilter;
