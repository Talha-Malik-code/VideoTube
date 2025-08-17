import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Dislike } from "../models/dislike.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoDislike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const dislikeExists = await Dislike.findOneAndDelete({
    video: videoId,
    dislikedBy: req.user?._id,
  });

  let newDislike;

  if (!dislikeExists) {
    newDislike = await Dislike.create({
      video: videoId,
      dislikedBy: req.user?._id,
    });
  }

  const dislikeCount = await Dislike.countDocuments({ video: videoId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        dislikedBy: dislikeExists ? {} : newDislike,
        isDisliked: !dislikeExists,
        dislikeCount: dislikeCount,
      },
      `Video ${dislikeExists ? "UnDisliked" : "Disliked"} successfully`
    )
  );
});

const toggleCommentDislike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const dislikeExists = await Dislike.findOneAndDelete({
    comment: commentId,
    dislikedBy: req.user?._id,
  });

  let newDislike;

  if (!dislikeExists) {
    newDislike = await Dislike.create({
      comment: commentId,
      dislikedBy: req.user?._id,
    });
  }

  const dislikeCount = await Dislike.countDocuments({ comment: commentId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        dislikedBy: dislikeExists ? {} : newDislike,
        isDisliked: !dislikeExists,
        dislikeCount,
      },
      `Comment ${dislikeExists ? "UnDisliked" : "Disliked"} successfully`
    )
  );
});

const toggleTweetDislike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  const dislikeExists = await Dislike.findOneAndDelete({
    tweet: tweetId,
    dislikedBy: req.user?._id,
  });

  let newDislike;

  if (!dislikeExists) {
    newDislike = await Dislike.create({
      tweet: tweetId,
      dislikedBy: req.user?._id,
    });
  }

  const dislikeCount = await Dislike.countDocuments({ tweet: tweetId });

  return res.status(200).json(
    new ApiResponse(200, {
      dislikedBy: dislikeExists ? {} : newDislike,
      isDisliked: !dislikeExists,
      dislikeCount,
    })
  );
});

const getDislikedVideos = asyncHandler(async (req, res) => {
  const dislikedVideos = await Dislike.aggregate([
    {
      $match: {
        dislikedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "dislikedVideos",
        pipeline: [
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
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$dislikedVideos",
    },
    {
      $project: {
        _id: 0,
        dislikedVideos: 1,
      },
    },
    {
      $replaceRoot: { newRoot: "$dislikedVideos" },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dislikedVideos,
        "Fetched Disliked Videos successfully"
      )
    );
});

export {
  toggleVideoDislike,
  toggleCommentDislike,
  toggleTweetDislike,
  getDislikedVideos,
};
