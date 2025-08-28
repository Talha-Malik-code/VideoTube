import React from "react";

const CoverImage = ({ coverImage }) => {
  return (
    <div className="relative min-h-[150px] w-full pt-[16.28%]">
      <div className="absolute inset-0 overflow-hidden">
        {/* <img
            src="https://images.pexels.com/photos/1092424/pexels-photo-1092424.jpeg?auto=compress"
            alt="cover-photo"
          /> */}
        <img
          src={coverImage ? coverImage : "../CoverImagePH.webp"}
          alt="cover-photo"
        />
      </div>
    </div>
  );
};

export default CoverImage;
