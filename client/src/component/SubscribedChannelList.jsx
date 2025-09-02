import React from "react";
import SubscribedChannelCard from "./SubscribedChannelCard";
import SubscribedToNotFound from "./notFound/SubscribedToNotFound";

const SubscribedChannelList = ({
  channels = [],
  isLoading = false,
  error = null,
  onSubscribeToggle,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-y-4 py-4 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex w-full justify-between animate-pulse"
          >
            <div className="flex items-center gap-x-2">
              <div className="h-14 w-14 shrink-0 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="block">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-24"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
            </div>
            <div className="block">
              <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        <div className="text-red-500 text-lg mb-2">
          Error loading subscribed channels
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">{error}</div>
      </div>
    );
  }

  if (!channels || channels.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-12 ${className}`}
      >
        <SubscribedToNotFound />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-y-4 py-4 ${className}`}>
      {channels.map((channel) => (
        <SubscribedChannelCard
          key={channel._id}
          channel={channel}
          isSubscribed={channel.isSubscribed}
          onSubscribeToggle={onSubscribeToggle}
        />
      ))}
    </div>
  );
};

export default SubscribedChannelList;
