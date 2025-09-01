import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsSubscribing,
  toggleSubscription,
  updateCachedChannelAvatar,
} from "../../../app/features/channelSlice";
import {
  updateAvatarImage,
  selectIsUpdatingAvatar,
  selectImageUploadError,
} from "../../../app/features/userSlice";
import AButton from "../../../component/AButton";
import Button from "../../../component/Button";
import EditIcon from "../../../component/iconComponents/EditIcon";
import { Link } from "react-router-dom";
import UploadFileCloudIcon from "../../../component/iconComponents/UploadFileCloudIcon";

const ChannelInfoSection = ({
  username,
  isEditable,
  channelData,
  profileImage,
  isMyChannel,
}) => {
  const dispatch = useDispatch();
  const isSubscribing = useSelector(selectIsSubscribing);
  const isUpdatingAvatar = useSelector(selectIsUpdatingAvatar);
  const imageUploadError = useSelector(selectImageUploadError);

  async function onSubscriptionToggle() {
    await dispatch(toggleSubscription(channelData?._id));
  }

  async function handleAvatarFileChange(e) {
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

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("File size should not exceed 5MB");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("avatar", file);
        const result = await dispatch(updateAvatarImage(formData));
        if (result.meta.requestStatus === "fulfilled") {
          dispatch(
            updateCachedChannelAvatar({
              username: username,
              avatar: result.payload.avatar,
            })
          );
        }
      } catch (error) {
        console.error("Failed to update avatar:", error);
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-4 pb-4 pt-6">
      {/* Display error message if avatar upload fails */}
      {imageUploadError && (
        <div className="w-full rounded bg-red-100 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Error updating avatar: {imageUploadError}
        </div>
      )}
      <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-[#e5e7eb]">
        <img src={profileImage} alt="Channel" className="h-full w-full" />
        {isEditable && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <input
              onChange={handleAvatarFileChange}
              type="file"
              id="profile-image"
              className="hidden"
              accept="image/*"
              disabled={isUpdatingAvatar}
            />
            <label
              htmlFor="profile-image"
              className={`inline-block h-8 w-8 rounded-lg bg-white/60 p-1 text-[#ae7aff] transition-all ${
                isUpdatingAvatar
                  ? "cursor-not-allowed opacity-90"
                  : "cursor-pointer hover:bg-white"
              }`}
            >
              {isUpdatingAvatar ? (
                <div className="animate-spin">
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
      </span>
      <div className="mr-auto inline-block">
        <h1 className="font-bolg text-xl text-black dark:text-white">
          {channelData?.fullName}
        </h1>
        <p className="text-sm text-gray-400">@{channelData?.username}</p>
        <p className="text-sm text-gray-400">
          {channelData.subscribersCount} Subscribers&nbsp;·&nbsp;
          {channelData.channelSubscribedToCount} Subscribed
        </p>
      </div>
      <div className="inline-block">
        <div className="inline-flex min-w-[145px] justify-end">
          {isMyChannel ? (
            isEditable ? (
              <Link to={`/channel/${username}`}>
                <AButton className="flex w-full items-center gap-x-2">
                  View channel
                </AButton>
              </Link>
            ) : (
              <Link to={`/channel/${username}?edit=true`}>
                <AButton className="flex w-full items-center gap-x-2">
                  <span className="inline-block w-5">
                    <EditIcon />
                  </span>
                  Edit
                </AButton>
              </Link>
            )
          ) : (
            <AButton
              className={`group/btn flex w-full items-center gap-x-2 transition-colors ${
                channelData.isSubscribed
                  ? "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                  : ""
              }`}
              onClick={onSubscriptionToggle}
              disabled={isSubscribing}
            >
              <span className="inline-block w-5">
                {channelData.isSubscribed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                )}
              </span>
              {channelData.isSubscribed ? "Subscribed" : "Subscribe"}
            </AButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelInfoSection;
