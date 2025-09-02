// Utility functions for tweet operations

export const searchTweets = (tweets, searchTerm) => {
  if (!tweets || !Array.isArray(tweets)) return [];
  if (!searchTerm || searchTerm.trim() === "") return tweets;

  const searchLower = searchTerm.toLowerCase().trim();

  return tweets.filter(
    (tweet) =>
      tweet.content.toLowerCase().includes(searchLower) ||
      tweet.author.fullName.toLowerCase().includes(searchLower) ||
      tweet.author.username.toLowerCase().includes(searchLower)
  );
};

export const filterTweets = (tweets, filters = {}) => {
  if (!tweets || !Array.isArray(tweets)) return [];

  let filteredTweets = [...tweets];

  // Filter by like status
  if (filters.liked !== undefined) {
    filteredTweets = filteredTweets.filter(
      (tweet) => tweet.isLiked === filters.liked
    );
  }

  // Filter by dislike status
  if (filters.disliked !== undefined) {
    filteredTweets = filteredTweets.filter(
      (tweet) => tweet.isDisliked === filters.disliked
    );
  }

  // Filter by author
  if (filters.authorId) {
    filteredTweets = filteredTweets.filter(
      (tweet) => tweet.author._id === filters.authorId
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    filteredTweets = filteredTweets.filter(
      (tweet) => new Date(tweet.createdAt) >= new Date(filters.dateFrom)
    );
  }

  if (filters.dateTo) {
    filteredTweets = filteredTweets.filter(
      (tweet) => new Date(tweet.createdAt) <= new Date(filters.dateTo)
    );
  }

  return filteredTweets;
};

export const sortTweets = (tweets, sortBy = "newest") => {
  if (!tweets || !Array.isArray(tweets)) return [];

  const sortedTweets = [...tweets];

  switch (sortBy) {
    case "newest":
      return sortedTweets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case "oldest":
      return sortedTweets.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

    case "most_liked":
      return sortedTweets.sort((a, b) => b.likeCount - a.likeCount);

    case "most_disliked":
      return sortedTweets.sort((a, b) => b.dislikeCount - a.dislikeCount);

    case "author_name":
      return sortedTweets.sort((a, b) =>
        a.author.fullName.localeCompare(b.author.fullName)
      );

    default:
      return sortedTweets;
  }
};

export const calculateTweetStats = (tweets) => {
  if (!tweets || !Array.isArray(tweets)) {
    return {
      totalTweets: 0,
      totalLikes: 0,
      totalDislikes: 0,
      averageLikes: 0,
      averageDislikes: 0,
    };
  }

  const totalTweets = tweets.length;
  const totalLikes = tweets.reduce((sum, tweet) => sum + tweet.likeCount, 0);
  const totalDislikes = tweets.reduce(
    (sum, tweet) => sum + tweet.dislikeCount,
    0
  );

  return {
    totalTweets,
    totalLikes,
    totalDislikes,
    averageLikes: totalTweets > 0 ? Math.round(totalLikes / totalTweets) : 0,
    averageDislikes:
      totalTweets > 0 ? Math.round(totalDislikes / totalTweets) : 0,
  };
};

export const getTweetCount = (tweets) => {
  if (!tweets || !Array.isArray(tweets)) return 0;
  return tweets.length;
};
