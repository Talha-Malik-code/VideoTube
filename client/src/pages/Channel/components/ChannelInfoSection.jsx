import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsSubscribing,
  toggleSubscription,
} from "../../../app/features/channelSlice";
import AButton from "../../../component/AButton";
import Button from "../../../component/Button";
import EditIcon from "../../../component/iconComponents/EditIcon";

const ChannelInfoSection = ({ channelData, profileImage, isEditable }) => {
  const dispatch = useDispatch();
  const isSubscribing = useSelector(selectIsSubscribing);

  async function onSubscriptionToggle() {
    await dispatch(toggleSubscription(channelData?._id));
  }

  return (
    <div className="flex flex-wrap gap-4 pb-4 pt-6">
      <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-[#e5e7eb]">
        <img src={profileImage} alt="Channel" className="h-full w-full" />
      </span>
      <div className="mr-auto inline-block">
        <h1 className="font-bolg text-xl text-black dark:text-white">
          React Patterns
        </h1>
        <p className="text-sm text-gray-400">@{channelData?.username}</p>
        <p className="text-sm text-gray-400">
          {channelData.subscribersCount} Subscribers&nbsp;·&nbsp;
          {channelData.channelSubscribedToCount} Subscribed
        </p>
      </div>
      <div className="inline-block">
        <div className="inline-flex min-w-[145px] justify-end">
          {isEditable ? (
            <AButton className="flex w-full items-center gap-x-2">
              <span className="inline-block w-5">
                <EditIcon />
              </span>
              Edit
            </AButton>
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
