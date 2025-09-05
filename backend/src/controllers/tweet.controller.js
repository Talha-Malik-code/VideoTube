import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    owner: req.user?._id,
    content,
  });

  if (!tweet) {
    throw new ApiError(500, "Error creating tweet");
  }

  const newTweet = await Tweet.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(tweet?._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, newTweet[0], "Tweet created successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy,
    sortType,
    userId,
    search,
  } = req.query;

  const matchStage = {};
  if (query || search) {
    const searchTerm = query || search;
    matchStage.$or = [
      { content: { $regex: searchTerm, $options: "i" } },
      { "owner.fullName": { $regex: searchTerm, $options: "i" } },
      { "owner.username": { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  const sort = {};
  const sortField = sortBy || "createdAt";
  const sortDirection = sortType === "asc" ? 1 : -1;
  sort[sortField] = sortDirection;

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        dislikesCount: { $size: "$dislikes" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        isDisliked: {
          $cond: {
            if: { $in: [req.user?._id, "$dislikes.dislikedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        likesCount: 1,
        dislikesCount: 1,
        isLiked: 1,
        isDisliked: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];

  const tweets = await Tweet.aggregatePaginate(Tweet.aggregate(pipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },
        dislikesCount: {
          $size: "$dislikes",
        },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        isDisliked: {
          $cond: {
            if: { $in: [req.user?._id, "$dislikes.dislikedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const tweets = await Tweet.aggregatePaginate(Tweet.aggregate(pipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(401, "Invalid tweet id");
  }

  if (!content) {
    throw new ApiError(400, "Conetnt is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  tweet.content = content;
  await tweet.save({ validateBeforeUpdate: true });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet Updated successfully"));
});

const getTweetStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId && !isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const matchStage = userId
    ? { owner: new mongoose.Types.ObjectId(userId) }
    : {};

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "dislikes",
      },
    },
    {
      $group: {
        _id: null,
        totalTweets: { $sum: 1 },
        totalLikes: { $sum: { $size: "$likes" } },
        totalDislikes: { $sum: { $size: "$dislikes" } },
        averageLikes: { $avg: { $size: "$likes" } },
        averageDislikes: { $avg: { $size: "$dislikes" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalTweets: 1,
        totalLikes: 1,
        totalDislikes: 1,
        averageLikes: { $round: ["$averageLikes", 2] },
        averageDislikes: { $round: ["$averageDislikes", 2] },
      },
    },
  ];

  const stats = await Tweet.aggregate(pipeline);

  const defaultStats = {
    totalTweets: 0,
    totalLikes: 0,
    totalDislikes: 0,
    averageLikes: 0,
    averageDislikes: 0,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || defaultStats,
        "Tweet statistics fetched successfully"
      )
    );
});

const getTweetsByHashtag = asyncHandler(async (req, res) => {
  const { hashtag } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!hashtag) {
    throw new ApiError(400, "Hashtag is required");
  }

  const pipeline = [
    {
      $match: {
        content: { $regex: `#${hashtag}`, $options: "i" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        dislikesCount: { $size: "$dislikes" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        isDisliked: {
          $cond: {
            if: { $in: [req.user?._id, "$dislikes.dislikedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        likesCount: 1,
        dislikesCount: 1,
        isLiked: 1,
        isDisliked: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  const tweets = await Tweet.aggregatePaginate(Tweet.aggregate(pipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tweets,
        `Tweets with hashtag #${hashtag} fetched successfully`
      )
    );
});

const getTrendingTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = "likes" } = req.query;

  const sort = {};
  if (sortBy === "likes") {
    sort.likesCount = -1;
  } else if (sortBy === "dislikes") {
    sort.dislikesCount = -1;
  } else {
    sort.createdAt = -1;
  }

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        dislikesCount: { $size: "$dislikes" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        isDisliked: {
          $cond: {
            if: { $in: [req.user?._id, "$dislikes.dislikedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        likesCount: 1,
        dislikesCount: 1,
        isLiked: 1,
        isDisliked: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];

  const tweets = await Tweet.aggregatePaginate(Tweet.aggregate(pipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Trending tweets fetched successfully"));
});

const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const tweet = await Tweet.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(tweetId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "tweet",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likesCount: { $size: "$likes" },
        dislikesCount: { $size: "$dislikes" },
        isLiked: {
          $cond: {
            if: { $in: [req.user?._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
        isDisliked: {
          $cond: {
            if: { $in: [req.user?._id, "$dislikes.dislikedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        likesCount: 1,
        dislikesCount: 1,
        isLiked: 1,
        isDisliked: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!tweet || !tweet.length) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet[0], "Tweet fetched successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(401, "Invalid tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export {
  createTweet,
  getAllTweets,
  getUserTweets,
  getTweetById,
  getTrendingTweets,
  getTweetsByHashtag,
  getTweetStats,
  updateTweet,
  deleteTweet,
};
