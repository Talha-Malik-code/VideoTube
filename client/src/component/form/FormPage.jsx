import React from "react";

const FormPage = ({ title, description, children, className = "" }) => {
  return (
    <div className={`flex flex-wrap justify-center gap-y-4 py-4 ${className}`}>
      {/* Left side - Title and Description */}
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold text-black dark:text-white">{title}</h5>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      {/* Right side - Form Content */}
      <div className="w-full sm:w-1/2 lg:w-2/3">{children}</div>
    </div>
  );
};

export default FormPage;
