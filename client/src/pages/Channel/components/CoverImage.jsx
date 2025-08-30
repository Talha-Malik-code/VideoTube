import React from "react";
import UploadFileCloudIcon from "../../../component/iconComponents/UploadFileCloudIcon";

const CoverImage = ({ coverImage, isEditable }) => {
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
        {isEditable && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <input type="file" id="cover-image" className="hidden" />
            <label
              htmlFor="cover-image"
              className="inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
            >
              <UploadFileCloudIcon />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;
