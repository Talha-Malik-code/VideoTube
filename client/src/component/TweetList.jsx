import React from "react";
import TweetCard from "./TweetCard";
import TweetNotFound from "./notFound/TweetNotFound";

const TweetList = ({
  tweets = [],
  isLoading = false,
  error = null,
  onLikeToggle,
  onDislikeToggle,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`py-4 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent animate-pulse"
          >
            <div className="h-14 w-14 shrink-0 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="w-full">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-32"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
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
        <div className="text-red-500 text-lg mb-2">Error loading tweets</div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">{error}</div>
      </div>
    );
  }

  if (!tweets || tweets.length === 0) {
    return (
      <div className={`py-4 ${className}`}>
        <TweetNotFound />
      </div>
    );
  }

  return (
    <div className={`py-4 ${className}`}>
      {tweets.map((tweet) => (
        <TweetCard
          key={tweet._id}
          tweet={tweet}
          onLikeToggle={onLikeToggle}
          onDislikeToggle={onDislikeToggle}
        />
      ))}
    </div>
  );
};

export default TweetList;
