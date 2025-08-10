import React from "react";

const ChannelAvatar = ({ src, alt, size = 40, className = "" }) => {
  const dimensionClass =
    typeof size === "number" ? `h-[${size}px] w-[${size}px]` : size;
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{
        height: typeof size === "number" ? `${size}px` : undefined,
        width: typeof size === "number" ? `${size}px` : undefined,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
};

export default ChannelAvatar;
