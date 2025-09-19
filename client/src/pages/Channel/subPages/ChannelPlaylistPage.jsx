import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../../app/features/userSlice";
import { selectChannelData } from "../../../app/features/channelSlice";
import PlaylistHeader from "../../../component/PlaylistHeader";
import PlaylistStats from "../../../component/PlaylistStats";
import PlaylistFilter from "../../../component/PlaylistFilter";
import PlaylistGrid from "../../../component/PlaylistGrid";
import PlaylistEmptyState from "../../../component/PlaylistEmptyState";
import PlaylistSkeleton from "../../../component/PlaylistSkeleton";
import { samplePlaylists } from "../../../data/samplePlaylists"; // Uncomment when needed

const ChannelPlaylistPage = () => {
  const user = useSelector(selectUserData);
  const channelData = useSelector(selectChannelData);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showStats, setShowStats] = useState(false);

  // Check if this is the logged-in user's channel
  const isMyChannel = user?.username === channelData?.username;

  useEffect(() => {
    // Simulate API call with sample data
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use sample data for now - in real app, this would be an API call
        // setPlaylists(samplePlaylists); // Commented out to show empty state
        setPlaylists(samplePlaylists);
      } catch (err) {
        setError("Failed to load playlists");
        console.error("Error fetching playlists:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleToggleStats = () => {
    setShowStats(!showStats);
  };

  const handleCreatePlaylist = () => {
    // TODO: Implement playlist creation
    console.log("Create playlist clicked");
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div>
        <PlaylistHeader
          channelName={channelData?.fullName || "Channel"}
          totalPlaylists={0}
          isMyChannel={isMyChannel}
        />
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 text-lg mb-2">
            Error loading playlists
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div>
        <PlaylistHeader
          channelName={channelData?.fullName || "Channel"}
          totalPlaylists={0}
          isMyChannel={isMyChannel}
        />
        <PlaylistEmptyState
          isMyChannel={isMyChannel}
          onCreatePlaylist={handleCreatePlaylist}
        />
      </div>
    );
  }

  return (
    <div>
      <PlaylistHeader
        channelName={channelData?.fullName || "Channel"}
        totalPlaylists={playlists.length}
        isMyChannel={isMyChannel}
      />

      {showStats && <PlaylistStats playlists={playlists} />}

      <PlaylistFilter
        sortBy={sortBy}
        onSortChange={handleSortChange}
        showStats={showStats}
        onToggleStats={handleToggleStats}
      />

      <PlaylistGrid
        playlists={playlists}
        isLoading={false}
        error={null}
        sortBy={sortBy}
      />
    </div>
  );
};

export default ChannelPlaylistPage;
