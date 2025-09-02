import React from "react";

const FormCard = ({
  header = null,
  children,
  footer = null,
  className = "",
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-white bg-white dark:bg-transparent ${className}`}
    >
      {/* Header */}
      {header && (
        <>
          <div className="p-4">{header}</div>
          <hr className="border border-gray-200 dark:border-white" />
        </>
      )}

      {/* Content */}
      <div className="flex flex-wrap gap-y-4 p-4">{children}</div>

      {/* Footer */}
      {footer && (
        <>
          <hr className="border border-gray-200 dark:border-white" />
          <div className="flex items-center justify-end gap-4 p-4">
            {footer}
          </div>
        </>
      )}
    </div>
  );
};

export default FormCard;
