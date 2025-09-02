import React from "react";

const ToolbarButton = ({
  children,
  onClick,
  isActive = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-[#ae7aff] focus:text-[#ae7aff] transition-colors ${
        isActive ? "text-[#ae7aff]" : ""
      } ${className}`}
      onClick={onClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
