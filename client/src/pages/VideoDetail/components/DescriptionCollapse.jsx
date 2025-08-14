import React from "react";

const DescriptionCollapse = ({ description }) => {
  return (
    <div className="h-5 overflow-hidden group-focus:h-auto">
      <p className="text-sm text-gray-800 dark:text-white">{description}</p>
    </div>
  );
};

export default DescriptionCollapse;
