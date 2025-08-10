import React from "react";

const Container = ({ children, className = "" }) => {
  return (
    <section
      className={`w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 ${className}`}
    >
      {children}
    </section>
  );
};

export default Container;
