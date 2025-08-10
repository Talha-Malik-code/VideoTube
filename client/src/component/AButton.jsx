import React from "react";

const AButton = ({
  children,
  bgColor = "dark:bg-[#ae7aff] bg-[#5936D9]",
  textColor = "text-white dark:text-black",
  className = "",
  styling = "mr-1 w-full px-3 py-2 text-center font-bold shadow-[5px_5px_0px_0px_#c7c7c7] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#c7c7c7] dark:shadow-[5px_5px_0px_0px_#4f4e4e] dark:active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto",
  ...props
}) => {
  return (
    <button
      className={`${bgColor} ${textColor} ${className} ${styling}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default AButton;
