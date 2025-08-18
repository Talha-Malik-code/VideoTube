import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10, parentId = null } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const videoObjectId = new mongoose.Types.ObjectId(videoId);
  const matchCondition = {
    video: videoObjectId,
  };

  // If parentId is provided, get replies to that comment
  if (parentId && isValidObjectId(parentId)) {
    matchCondition.parent = new mongoose.Types.ObjectId(parentId);
  } else {
    // Get top-level comments (no parent)
    matchCondition.parent = null;
  }

  const pipeline = [
    {
      $match: matchCondition,
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
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "comment",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likeCount: { $size: "$likes" },
        dislikeCount: { $size: "$dislikes" },
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
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        likeCount: 1,
        dislikeCount: 1,
        isLiked: 1,
        isDisliked: 1,
        replyCount: 1,
        parent: 1,
      },
    },
  ];

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    {
      page: parseInt(page),
      limit: parseInt(limit),
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  const commentObjectId = new mongoose.Types.ObjectId(commentId);

  const pipeline = [
    {
      $match: {
        parent: commentObjectId,
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
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "comment",
        as: "dislikes",
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
        likeCount: { $size: "$likes" },
        dislikeCount: { $size: "$dislikes" },
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
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        likeCount: 1,
        dislikeCount: 1,
        isLiked: 1,
        isDisliked: 1,
        parent: 1,
      },
    },
  ];

  const replies = await Comment.aggregatePaginate(Comment.aggregate(pipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, replies, "Replies fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content, parentId = null } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  // If this is a reply, verify the parent comment exists
  if (parentId) {
    if (!isValidObjectId(parentId)) {
      throw new ApiError(400, "Invalid parent comment id");
    }

    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      throw new ApiError(404, "Parent comment not found");
    }
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
    parent: parentId,
  });

  if (!comment) {
    throw new ApiError(500, "Error creating comment");
  }

  // If this is a reply, update the parent comment's replyCount
  if (parentId) {
    await Comment.findByIdAndUpdate(parentId, {
      $inc: { replyCount: 1 },
      $push: { replies: comment._id },
    });
  }

  const populatedComment = await Comment.aggregate([
    {
      $match: {
        _id: comment._id,
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
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        replyCount: 1,
        parent: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedComment[0], "Comment created successfully")
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment id");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unaouthorized request");
  }

  comment.content = content;
  comment.save({ validateBeforeSave: false });

  const populatedComment = await Comment.aggregate([
    {
      $match: {
        _id: comment._id,
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
    {
      $project: {
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: 1,
        replyCount: 1,
        parent: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, populatedComment[0], "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "Comment id required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(409, "Invalid comment id");
  }

  if (comment.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized request");
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // If this is a reply, update the parent comment's replyCount and remove from replies array
    if (comment.parent) {
      await Comment.findByIdAndUpdate(
        comment.parent,
        {
          $inc: { replyCount: -1 },
          $pull: { replies: comment._id },
        },
        { session }
      );
    }

    // Recursively delete all nested replies
    const deleteRepliesRecursively = async (parentCommentId) => {
      // Find all replies to this comment
      const replies = await Comment.find({ parent: parentCommentId }).session(
        session
      );

      // Recursively delete each reply and its nested replies
      for (const reply of replies) {
        await deleteRepliesRecursively(reply._id);
        await Comment.findByIdAndDelete(reply._id, { session });
      }
    };

    // Delete all nested replies first
    await deleteRepliesRecursively(commentId);

    // Finally delete the main comment
    await Comment.findByIdAndDelete(commentId, { session });

    // Commit the transaction
    await session.commitTransaction();

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Comment and all replies deleted successfully")
      );
  } catch (error) {
    // If anything fails, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
});

export {
  getVideoComments,
  getCommentReplies,
  addComment,
  updateComment,
  deleteComment,
};
