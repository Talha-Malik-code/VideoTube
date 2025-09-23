import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../../app/features/userSlice";
import {
  getChannelPlaylists,
  selectChannelData,
  selectChannelPlaylists,
  selectChannelPlaylistsError,
  selectChannelPlaylistsLoading,
} from "../../../app/features/channelSlice";
import PlaylistHeader from "../../../component/PlaylistHeader";
import PlaylistStats from "../../../component/PlaylistStats";
import PlaylistFilter from "../../../component/PlaylistFilter";
import PlaylistGrid from "../../../component/PlaylistGrid";
import PlaylistEmptyState from "../../../component/PlaylistEmptyState";
import PlaylistSkeleton from "../../../component/PlaylistSkeleton";
import PlaylistNotFound from "../../../component/notFound/PlaylistNotFound";

const ChannelPlaylistPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const channelData = useSelector(selectChannelData);
  const channelPlaylists = useSelector(selectChannelPlaylists);
  const channelPlaylistsLoading = useSelector(selectChannelPlaylistsLoading);
  const channelPlaylistsError = useSelector(selectChannelPlaylistsError);
  const [sortBy, setSortBy] = useState("newest");
  const [showStats, setShowStats] = useState(false);

  // Check if this is the logged-in user's channel
  const isMyChannel = user?.username === channelData?.username;

  useEffect(() => {
    dispatch(getChannelPlaylists(channelData?._id));
  }, [dispatch, channelData?._id]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  if (channelPlaylistsLoading) {
    return (
      <div>
        <PlaylistHeader
          channelName={channelData?.fullName || "Channel"}
          totalPlaylists={0}
          isMyChannel={isMyChannel}
        />
        <PlaylistSkeleton count={6} />
      </div>
    );
  }

  if (channelPlaylistsError) {
    return (
      <div>
        <PlaylistHeader
          channelName={channelData?.fullName || "Channel"}
          totalPlaylists={0}
          isMyChannel={isMyChannel}
        />
        {channelPlaylistsError === "Playlist not found" ? (
          <PlaylistNotFound />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-lg mb-2">
              Error loading playlists
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {channelPlaylistsError}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!channelPlaylists || channelPlaylists.length === 0) {
    return (
      <div>
        <PlaylistHeader
          channelName={channelData?.fullName || "Channel"}
          totalPlaylists={0}
          isMyChannel={isMyChannel}
        />
        <PlaylistEmptyState isMyChannel={isMyChannel} />
      </div>
    );
  }

  return (
    <div>
      <PlaylistHeader
        channelName={channelData?.fullName || "Channel"}
        totalPlaylists={channelPlaylists.length}
        isMyChannel={isMyChannel}
      />

      {showStats && <PlaylistStats playlists={channelPlaylists} />}

      <PlaylistFilter
        sortBy={sortBy}
        onSortChange={handleSortChange}
        showStats={showStats}
        onToggleStats={handleToggleStats}
      />

      <PlaylistGrid
        playlists={channelPlaylists}
        isLoading={false}
        error={null}
        sortBy={sortBy}
      />
    </div>
  );
};

export default ChannelPlaylistPage;
