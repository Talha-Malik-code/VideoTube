import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "../../../app/features/userSlice";
import { selectChannelData } from "../../../app/features/channelSlice";
import TweetHeader from "../../../component/TweetHeader";
import SearchBar from "../../../component/SearchBar";
import TweetInput from "../../../component/TweetInput";
import TweetList from "../../../component/TweetList";
import { sampleTweets } from "../../../data/sampleTweets";
import {
  searchTweets,
  sortTweets,
  getTweetCount,
} from "../../../utils/tweetUtils";

const ChannelTweetsPage = () => {
  const user = useSelector(selectUserData);
  const channelData = useSelector(selectChannelData);
  const [tweets, setTweets] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Check if this is the logged-in user's channel
  const isMyChannel = user?.username === channelData?.username;

  useEffect(() => {
    // Simulate API call with sample data
    const fetchTweets = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use sample data for now - in real app, this would be an API call
        setTweets(sampleTweets);
      } catch (err) {
        setError("Failed to load tweets");
        console.error("Error fetching tweets:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
  }, []);

  // Update filtered tweets when search term or sort changes
  useEffect(() => {
    if (tweets.length > 0) {
      let filtered = searchTweets(tweets, searchTerm);
      filtered = sortTweets(filtered, sortBy);
      setFilteredTweets(filtered);
    }
  }, [tweets, searchTerm, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLikeToggle = (tweetId, newLikeStatus) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) => {
        if (tweet._id === tweetId) {
          const newLikeCount = newLikeStatus
            ? tweet.likeCount + 1
            : tweet.likeCount - 1;
          return {
            ...tweet,
            isLiked: newLikeStatus,
            likeCount: Math.max(0, newLikeCount),
            // If liking, remove dislike
            isDisliked: newLikeStatus ? false : tweet.isDisliked,
            dislikeCount: newLikeStatus
              ? Math.max(0, tweet.dislikeCount - 1)
              : tweet.dislikeCount,
          };
        }
        return tweet;
      })
    );
  };

  const handleDislikeToggle = (tweetId, newDislikeStatus) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) => {
        if (tweet._id === tweetId) {
          const newDislikeCount = newDislikeStatus
            ? tweet.dislikeCount + 1
            : tweet.dislikeCount - 1;
          return {
            ...tweet,
            isDisliked: newDislikeStatus,
            dislikeCount: Math.max(0, newDislikeCount),
            // If disliking, remove like
            isLiked: newDislikeStatus ? false : tweet.isLiked,
            likeCount: newDislikeStatus
              ? Math.max(0, tweet.likeCount - 1)
              : tweet.likeCount,
          };
        }
        return tweet;
      })
    );
  };

  const handleNewTweet = async (tweetContent) => {
    // Create a new tweet object
    const newTweet = {
      _id: `tweet_${Date.now()}`,
      author: {
        _id: user?._id || "user_1",
        username: user?.username || "reactpatterns",
        fullName: user?.fullName || "React Patterns",
        avatar:
          user?.avatar ||
          "https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      content: tweetContent,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      dislikeCount: 0,
      isLiked: false,
      isDisliked: false,
    };

    // Add the new tweet to the beginning of the list
    setTweets((prevTweets) => [newTweet, ...prevTweets]);

    // In a real app, you would make an API call here
    console.log("New tweet submitted:", newTweet);
  };

  const tweetCount = getTweetCount(tweets);

  if (isLoading) {
    return (
      <div>
        <TweetHeader
          channelName={channelData?.fullName || "Channel"}
          totalTweets={0}
          isMyChannel={isMyChannel}
        />
        <TweetList
          tweets={[]}
          isLoading={true}
          error={null}
          onLikeToggle={handleLikeToggle}
          onDislikeToggle={handleDislikeToggle}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TweetHeader
          channelName={channelData?.fullName || "Channel"}
          totalTweets={0}
          isMyChannel={isMyChannel}
        />
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 text-lg mb-2">Error loading tweets</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TweetHeader
        channelName={channelData?.fullName || "Channel"}
        totalTweets={tweetCount}
        isMyChannel={isMyChannel}
      />

      <SearchBar
        placeholder="Search tweets..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4"
      />

      {/* Show tweet input only for the channel owner */}
      {isMyChannel && <TweetInput onSubmit={handleNewTweet} className="mb-4" />}

      <TweetList
        tweets={filteredTweets}
        isLoading={false}
        error={null}
        onLikeToggle={handleLikeToggle}
        onDislikeToggle={handleDislikeToggle}
      />
    </div>
  );
};

export default ChannelTweetsPage;
