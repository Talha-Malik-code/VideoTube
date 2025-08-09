import React, { useId, useState } from "react";

const Input = React.forwardRef(function Input(
  {
    label,
    type = "text",
    placeholder = "",
    className = "",
    error = null,
    ...props
  },
  ref
) {
  const id = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const isPasswordType = type === "password";
  const inputType = isPasswordType && isPasswordVisible ? "text" : type;

  return (
    <div className={`w-full mb-4`}>
      <label
        htmlFor={id}
        className="mb-1 inline-block text-gray-600 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          className={`rounded-lg border border-gray-300 bg-white dark:border-white dark:bg-transparent px-3 py-2 w-full ${
            isPasswordType ? "pr-10" : ""
          } ${className}`}
          {...props}
          ref={ref}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0112 5.25c4.789 0 8.934 2.94 10.02 7.18a1.5 1.5 0 010 .969c-1.086 4.24-5.331 7.179-10.02 7.179-4.789 0-8.933-2.939-10.02-7.179a1.5 1.5 0 010-.969c1.086-4.24 5.331-7.18 10.02-7.18zm.908 6.78a5.25 5.25 0 005.922 4.298"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 4.5l15 15"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.01 9.963 7.182a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.01-9.963-7.182z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {!!error && <p className="text-red-500">*{error}</p>}
    </div>
  );
});

export default Input;
