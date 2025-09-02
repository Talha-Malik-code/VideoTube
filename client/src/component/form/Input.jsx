import React from "react";

const Input = React.forwardRef(
  (
    {
      label,
      id,
      type = "text",
      placeholder = "",
      value = "",
      className = "",
      width = "w-full",
      icon: Icon = null,
      prefix = "",
      helpText = "",
      error = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

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

        <div className="relative">
          {/* Prefix text (like vidplay.com/) */}
          {prefix && (
            <div className="flex rounded-lg border border-gray-200 dark:border-white">
              <p className="flex shrink-0 items-center border-r border-gray-200 dark:border-white px-3 align-middle text-black dark:text-white bg-gray-50 dark:bg-transparent">
                {prefix}
              </p>
              <input
                type={type}
                className={`w-full bg-transparent px-2 py-1.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${className}`}
                id={inputId}
                placeholder={placeholder}
                value={value}
                ref={ref}
                {...props}
              />
            </div>
          )}

          {/* Input with icon */}
          {!prefix && Icon && (
            <div className="relative">
              <div className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300">
                <Icon />
              </div>
              <input
                type={type}
                className={`w-full rounded-lg border border-gray-200 dark:border-white bg-white dark:bg-transparent py-1.5 pl-8 pr-2 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${className}`}
                id={inputId}
                placeholder={placeholder}
                value={value}
                ref={ref}
                {...props}
              />
            </div>
          )}

          {/* Regular input */}
          {!prefix && !Icon && (
            <input
              type={type}
              className={`w-full rounded-lg border border-gray-200 dark:border-white bg-white dark:bg-transparent px-2 py-1.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ${className}`}
              id={inputId}
              placeholder={placeholder}
              value={value}
              ref={ref}
              {...props}
            />
          )}
        </div>

        {/* Help text */}
        {helpText && (
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

export default Input;
