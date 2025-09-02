import React from "react";

const SubscribedChannelHeader = ({
  channelName,
  totalSubscribed = 0,
  isMyChannel = false,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {isMyChannel
              ? "My Subscriptions"
              : `${channelName}'s Subscriptions`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {totalSubscribed} subscribed channel
            {totalSubscribed !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700"></div>
    </div>
  );
};

export default SubscribedChannelHeader;
