// Utility functions for subscribed channel operations

export const searchSubscribedChannels = (channels, searchTerm) => {
  if (!channels || !Array.isArray(channels)) return [];
  if (!searchTerm || searchTerm.trim() === "") return channels;

  const searchLower = searchTerm.toLowerCase().trim();

  return channels.filter(
    (channel) =>
      channel.fullName.toLowerCase().includes(searchLower) ||
      channel.username.toLowerCase().includes(searchLower)
  );
};

export const filterSubscribedChannels = (channels, filters = {}) => {
  if (!channels || !Array.isArray(channels)) return [];

  let filteredChannels = [...channels];

  // Filter by subscription status
  if (filters.subscriptionStatus !== undefined) {
    filteredChannels = filteredChannels.filter(
      (channel) => channel.isSubscribed === filters.subscriptionStatus
    );
  }

  // Filter by subscriber count range
  if (filters.minSubscribers !== undefined) {
    filteredChannels = filteredChannels.filter(
      (channel) => channel.subscriberCount >= filters.minSubscribers
    );
  }

  if (filters.maxSubscribers !== undefined) {
    filteredChannels = filteredChannels.filter(
      (channel) => channel.subscriberCount <= filters.maxSubscribers
    );
  }

  return filteredChannels;
};

export const sortSubscribedChannels = (channels, sortBy = "name") => {
  if (!channels || !Array.isArray(channels)) return [];

  const sortedChannels = [...channels];

  switch (sortBy) {
    case "name":
      return sortedChannels.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

    case "username":
      return sortedChannels.sort((a, b) =>
        a.username.localeCompare(b.username)
      );

    case "subscribers_high":
      return sortedChannels.sort(
        (a, b) => b.subscriberCount - a.subscriberCount
      );

    case "subscribers_low":
      return sortedChannels.sort(
        (a, b) => a.subscriberCount - b.subscriberCount
      );

    case "subscribed_first":
      return sortedChannels.sort((a, b) => {
        if (a.isSubscribed === b.isSubscribed) return 0;
        return a.isSubscribed ? -1 : 1;
      });

    case "unsubscribed_first":
      return sortedChannels.sort((a, b) => {
        if (a.isSubscribed === b.isSubscribed) return 0;
        return a.isSubscribed ? 1 : -1;
      });

    default:
      return sortedChannels;
  }
};

export const calculateSubscribedChannelStats = (channels) => {
  if (!channels || !Array.isArray(channels)) {
    return {
      totalChannels: 0,
      subscribedCount: 0,
      unsubscribedCount: 0,
      totalSubscribers: 0,
      averageSubscribers: 0,
    };
  }

  const totalChannels = channels.length;
  const subscribedCount = channels.filter(
    (channel) => channel.isSubscribed
  ).length;
  const unsubscribedCount = totalChannels - subscribedCount;
  const totalSubscribers = channels.reduce(
    (sum, channel) => sum + channel.subscriberCount,
    0
  );

  return {
    totalChannels,
    subscribedCount,
    unsubscribedCount,
    totalSubscribers,
    averageSubscribers:
      totalChannels > 0 ? Math.round(totalSubscribers / totalChannels) : 0,
  };
};

export const getSubscribedChannelCount = (channels) => {
  if (!channels || !Array.isArray(channels)) return 0;
  return channels.filter((channel) => channel.isSubscribed).length;
};
