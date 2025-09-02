import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../../app/features/userSlice";
import { selectChannelData } from "../../../app/features/channelSlice";
import SubscribedChannelHeader from "../../../component/SubscribedChannelHeader";
import SearchBar from "../../../component/SearchBar";
import SubscribedChannelList from "../../../component/SubscribedChannelList";
import { sampleSubscribedChannels } from "../../../data/sampleSubscribedChannels";
import {
  searchSubscribedChannels,
  sortSubscribedChannels,
  // calculateSubscribedChannelStats,
  getSubscribedChannelCount,
} from "../../../utils/subscribedChannelUtils";

const ChannelSubscribedListPage = () => {
  const user = useSelector(selectUserData);
  const channelData = useSelector(selectChannelData);
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Check if this is the logged-in user's channel
  const isMyChannel = user?.username === channelData?.username;

  useEffect(() => {
    // Simulate API call with sample data
    const fetchSubscribedChannels = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use sample data for now - in real app, this would be an API call
        setChannels(sampleSubscribedChannels);
      } catch (err) {
        setError("Failed to load subscribed channels");
        console.error("Error fetching subscribed channels:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, []);

  // Update filtered channels when search term or sort changes
  useEffect(() => {
    if (channels.length > 0) {
      let filtered = searchSubscribedChannels(channels, searchTerm);
      filtered = sortSubscribedChannels(filtered, sortBy);
      setFilteredChannels(filtered);
    }
  }, [channels, searchTerm, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // const handleSortChange = (newSortBy) => {
  //   setSortBy(newSortBy);
  // };

  const handleSubscribeToggle = (channelId, newSubscriptionStatus) => {
    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel._id === channelId
          ? { ...channel, isSubscribed: newSubscriptionStatus }
          : channel
      )
    );
  };

  // const stats = calculateSubscribedChannelStats(channels);
  const subscribedCount = getSubscribedChannelCount(channels);

  if (isLoading) {
    return (
      <div>
        <SubscribedChannelHeader
          channelName={channelData?.fullName || "Channel"}
          totalSubscribed={0}
          isMyChannel={isMyChannel}
        />
        <SubscribedChannelList
          channels={[]}
          isLoading={true}
          error={null}
          onSubscribeToggle={handleSubscribeToggle}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SubscribedChannelHeader
          channelName={channelData?.fullName || "Channel"}
          totalSubscribed={0}
          isMyChannel={isMyChannel}
        />
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 text-lg mb-2">
            Error loading subscribed channels
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SubscribedChannelHeader
        channelName={channelData?.fullName || "Channel"}
        totalSubscribed={subscribedCount}
        isMyChannel={isMyChannel}
      />

      <SearchBar
        placeholder="Search channels..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4"
      />

      <SubscribedChannelList
        channels={filteredChannels}
        isLoading={false}
        error={null}
        onSubscribeToggle={handleSubscribeToggle}
      />
    </div>
  );
};

export default ChannelSubscribedListPage;
