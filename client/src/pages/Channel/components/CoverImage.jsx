import React from "react";
import UploadFileCloudIcon from "../../../component/iconComponents/UploadFileCloudIcon";
import {
  selectIsUpdatingCover,
  updateCoverImage,
} from "../../../app/features/userSlice";
import { updateCachedChannelCoverImage } from "../../../app/features/channelSlice";
import { useDispatch, useSelector } from "react-redux";

const CoverImage = ({ coverImage, isEditable, username }) => {
  const dispatch = useDispatch();
  const isUpdatingCover = useSelector(selectIsUpdatingCover);

  async function handleCoverImageFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert("File size should not exceed 10MB");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("coverImage", file);
        const result = await dispatch(updateCoverImage(formData));
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(
            updateCachedChannelCoverImage({
              username: username,
              coverImage: result.payload.coverImage,
            })
          );
        }
      } catch (error) {
        console.error("Failed to update cover image:", error);
      }
    }
  }
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
            <input
              onChange={handleCoverImageFileChange}
              type="file"
              id="cover-image"
              className="hidden"
              accept="image/*"
              disabled={isUpdatingCover}
            />
            <label
              htmlFor="cover-image"
              className="inline-block h-10 w-10 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
            >
              {isUpdatingCover ? (
                <div className="animate-spin flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    {/* Top triangle */}
                    <polygon
                      points="4,3 20,3 12,12"
                      fill="rgba(0,0,0,0.1)" // lighter fill
                      stroke="currentColor"
                    />
                    {/* Bottom triangle */}
                    <polygon
                      points="4,21 20,21 12,12"
                      fill="rgba(0,0,0,0.1)" // lighter fill
                      stroke="currentColor"
                    />
                  </svg>
                </div>
              ) : (
                <UploadFileCloudIcon />
              )}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverImage;
