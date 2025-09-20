import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../../app/features/userSlice";
import {
  getSubscribedChannels,
  selectChannelData,
  selectSubscribedChannels,
  selectSubscribedChannelsError,
  selectSubscribedChannelsLoading,
} from "../../../app/features/channelSlice";
import SubscribedChannelHeader from "../../../component/SubscribedChannelHeader";
import SearchBar from "../../../component/SearchBar";
import SubscribedChannelList from "../../../component/SubscribedChannelList";
import {
  searchSubscribedChannels,
  sortSubscribedChannels,
} from "../../../utils/subscribedChannelUtils";

const ChannelSubscribedListPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const channelData = useSelector(selectChannelData);
  const { subscribedChannels, subscribedCount } = useSelector(
    selectSubscribedChannels
  );
  const subscribedChannelsLoading = useSelector(
    selectSubscribedChannelsLoading
  );
  const subscribedChannelsError = useSelector(selectSubscribedChannelsError);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const sortBy = "name";

  // Check if this is the logged-in user's channel
  const isMyChannel = user?.username === channelData?.username;

  useEffect(() => {
    let ignore = false;
    if (!ignore && channelData?._id) {
      dispatch(getSubscribedChannels(channelData?._id));
    }

    return () => {
      ignore = true;
    };
  }, [dispatch, channelData?._id]);

  // Update filtered channels when search term or sort changes
  useEffect(() => {
    let filtered = searchSubscribedChannels(subscribedChannels, searchTerm);
    filtered = sortSubscribedChannels(filtered, sortBy);
    setFilteredChannels(filtered);
  }, [subscribedChannels, searchTerm, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  console.log("Filtered Channels", filteredChannels);
  console.log("Subscribed Channels", subscribedChannels);

  // const handleSortChange = (newSortBy) => {
  //   setSortBy(newSortBy);
  // };

  if (subscribedChannelsLoading || subscribedChannels.isNotFetched) {
    return (
      <div>
        <SubscribedChannelHeader
          channelName={channelData?.fullName || "Channel"}
          totalSubscribed={0}
          isMyChannel={isMyChannel}
        />
        <SubscribedChannelList channels={[]} isLoading={true} error={null} />
      </div>
    );
  }

  if (subscribedChannelsError) {
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
            {subscribedChannelsError}
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
      />
    </div>
  );
};

export default ChannelSubscribedListPage;
