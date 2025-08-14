import React from "react";
import ChannelAvatar from "../../Home/videoComponents/ChannelAvatar";
import AButton from "../../../component/AButton";

const ChannelBar = ({ channel, isSubscribed, onSubscriptionToggle }) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <div className="mt-2 h-12 w-12 shrink-0">
          <ChannelAvatar src={channel.avatar} alt={channel.name} size={48} />
        </div>
        <div className="block">
          <p className="text-gray-900 dark:text-gray-200">{channel.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {channel.subscribers}
          </p>
        </div>
      </div>
      <div className="block">
        <AButton
          className={`group/btn flex w-full items-center gap-x-2 transition-colors ${
            isSubscribed
              ? "bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
              : ""
          }`}
          onClick={onSubscriptionToggle}
        >
          <span className="inline-block w-5">
            {isSubscribed ? (
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
          {isSubscribed ? "Subscribed" : "Subscribe"}
        </AButton>
      </div>
    </div>
  );
};

export default ChannelBar;
