import React, { useId } from "react";

const FileInput = React.forwardRef(function FileInput({
  label = "Upload a file",
  className = "",
  file = null,
  ...props
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>
        <span
          className={`flex gap-2 max-w-fit rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black dark:border-white dark:bg-transparent dark:text-white ${className}`}
        >
          {!file ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          ) : (
            //user profile icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
            </svg>
          )}
          {file ? file.name : label}
        </span>
      </label>
      <input
        className="sr-only"
        type="file"
        id={id}
        accept="image/*"
        {...props}
      />
    </div>
  );
});

export default FileInput;
