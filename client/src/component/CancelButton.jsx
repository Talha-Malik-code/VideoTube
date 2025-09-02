import React from "react";

const CancelButton = ({ children = "Cancel", className = "", ...props }) => {
  return (
    <button
      className={`inline-block rounded-lg border border-gray-200 dark:border-white bg-white dark:bg-transparent px-3 py-1.5 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CancelButton;
