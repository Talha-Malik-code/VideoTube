import React from "react";

const Select = React.forwardRef(
  (
    {
      label,
      id,
      options = [],
      value = "",
      className = "",
      width = "w-full",
      icon: Icon = null,
      helpText = "",
      error = "",
      placeholder = "Select an option",
      ...props
    },
    ref
  ) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

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
          {Icon && (
            <div className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-300 z-10">
              <Icon />
            </div>
          )}

          <select
            className={`w-full ${
              Icon ? "pl-8" : "pl-2"
            } rounded-lg border border-gray-200 dark:border-white border-r-8 border-transparent bg-white dark:bg-transparent py-1.5 pr-2 text-black dark:text-white focus:outline-none ${className}`}
            id={inputId}
            value={value}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

export default Select;
