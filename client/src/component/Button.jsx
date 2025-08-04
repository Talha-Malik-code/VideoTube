import React from "react";

const Button = ({
  children,
  bgColor = "dark:bg-[#ae7aff] bg-[#5936D9]",
  textColor = "dark:text-black text-white",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-3 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
