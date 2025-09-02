import React from "react";

const Textarea = React.forwardRef(
  (
    {
      label,
      id,
      placeholder = "",
      value = "",
      className = "",
      width = "w-full",
      rows = 4,
      helpText = "",
      error = "",
      maxLength = null,
      showCharCount = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = value?.length || 0;
    const remainingChars = maxLength ? maxLength - currentLength : null;

    return (
      <div className={width}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 inline-block text-black dark:text-white"
          >
            {label}
          </label>
        )}

        <textarea
          className={`w-full rounded-lg border border-gray-200 dark:border-white bg-white dark:bg-transparent px-2 py-1.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-vertical ${className}`}
          id={inputId}
          placeholder={placeholder}
          value={value}
          rows={rows}
          maxLength={maxLength}
          ref={ref}
          {...props}
        />

        {/* Character count */}
        {showCharCount && maxLength && (
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
            {remainingChars} characters left
          </p>
        )}

        {/* Help text */}
        {helpText && !showCharCount && (
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
            {helpText}
          </p>
        )}

        {/* Error text */}
        {error && (
          <p className="mt-0.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default Textarea;
