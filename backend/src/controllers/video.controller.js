import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import fs from "fs";
import extractPublicId from "../utils/extractPublicId.js";
import mongoose from "mongoose";

function formatSeconds(totalSec) {
  const sec = Number(totalSec);
  if (!Number.isFinite(sec) || sec < 0) {
    return "0:00";
  }

  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);

  const padZero = (num) => String(num).padStart(2, "0");

  if (h > 0) {
    return `${h}:${padZero(m)}:${padZero(s)}`;
  } else {
    return `${m}:${padZero(s)}`;
  }
}

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const matchStage = {};
  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  matchStage.isPublished = true;

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
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: {
                $size: "$subscribers",
              },
            },
          },
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
              subscribersCount: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];

  const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!req.files.video[0].mimetype.startsWith("video/")) {
    fs.unlinkSync(videoLocalPath);
    fs.unlinkSync(thumbnailLocalPath);
    throw new ApiError(401, "Invalid file type. Only video can be uploaded");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideo?.url) {
    throw new ApiError(500, "Error uploading video on cloudinary");
  }

  if (!uploadedThumbnail?.url) {
    throw new ApiError(500, "Error uploading thumbnail on cloudinary");
  }

  const video = await Video.create({
    title,
    description,
    thumbnail: uploadedThumbnail.url,
    videoFile: uploadedVideo.url,
    duration: formatSeconds(uploadedVideo.duration),
    owner: req.user?._id,
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong while publishing the video");
  }

  const videoWithUser = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(video?._id),
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
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoWithUser[0], "Video published successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
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
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" },
              isSubscribed: {
                $in: [
                  new mongoose.Types.ObjectId(req.user?._id),
                  {
                    $reduce: {
                      input: "$subscribers",
                      initialValue: [],
                      in: { $concatArrays: ["$$value", ["$$this.subscriber"]] },
                    },
                  },
                ],
              },
            },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              subscribersCount: 1,
              isSubscribed: 1,
              subscribers: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "comment",
              as: "likes",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "likedBy",
                    foreignField: "_id",
                    as: "likedBy",
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
                  $addFields: {
                    totalLikes: {
                      $size: "$likedBy",
                    },
                    isLiked: {
                      $cond: {
                        if: {
                          $in: [
                            new mongoose.Types.ObjectId(req.user?._id),
                            "$likedBy._id",
                          ],
                        },
                        then: true,
                        else: false,
                      },
                    },
                  },
                },
                {
                  $project: {
                    totalLikes: 1,
                    isLiked: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$videoLikes" },
        isLiked: {
          $in: [
            new mongoose.Types.ObjectId(req.user?._id),
            "$videoLikes.likedBy",
          ],
        },
      },
    },
    {
      $lookup: {
        from: "dislikes",
        localField: "_id",
        foreignField: "video",
        as: "videoDislikes",
      },
    },
    {
      $addFields: {
        totalDislikes: { $size: "$videoDislikes" },
        isDisliked: {
          $in: [
            new mongoose.Types.ObjectId(req.user?._id),
            "$videoDislikes.dislikedBy",
          ],
        },
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!video) {
    throw new ApiError(400, "Invalid video id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new ApiError(400, "All feilds are required");
  }

  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "All feilds are required");
  }

  const video = await Video.findById(videoId);

  if (String(video?.owner) !== String(req?.user?._id)) {
    throw new ApiError(
      401,
      "Unauthorized Request. Only owner can update video details."
    );
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedVideo) {
    throw new ApiError(401, "Invalid video id");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video details updated successfully")
    );
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailLocalPath = req.file.path;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const oldVideo = await Video.findById(videoId);

  if (String(video?.owner) !== String(req?.user?._id)) {
    throw new ApiError(
      401,
      "Unauthorized Request. Only owner can update video thumbnail."
    );
  }

  const oldThumbnail = oldVideo.thumbnail;
  const oldThumbnailParts = oldThumbnail.split("/");
  const oldThumbnailPublicId =
    oldThumbnailParts[oldThumbnailParts.length - 1].split(".")[0];

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail.url) {
    throw new ApiError(500, "Error uploading thumbnail");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  if (!video) {
    throw new ApiError(400, "Invalid video id");
  }

  await deleteFromCloudinary(oldThumbnailPublicId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Invalid video id");
  }

  if (String(video?.owner) !== String(req?.user?._id)) {
    throw new ApiError(
      401,
      "Unauthorized Request. Only owner can update video details."
    );
  }

  const thumbnail = video.thumbnail;
  const videoFile = video.videoFile;

  const thumbnailPublicId = extractPublicId(thumbnail);
  const videoPublicId = extractPublicId(videoFile);

  const deleteResponse = await Video.deleteOne({
    _id: videoId,
  });

  if (!deleteResponse.deletedCount) {
    throw new ApiError(500, "Error deleting video document");
  }

  const thumbnailDeleteResponse = await deleteFromCloudinary(thumbnailPublicId);
  const videoDeleteResponse = await deleteFromCloudinary(
    videoPublicId,
    "video"
  );

  if (thumbnailDeleteResponse.result !== "ok") {
    throw new ApiError(500, "Error deleting thumbnail from cloud storage");
  }

  console.log("video public id", videoPublicId);
  console.log("video delete response", videoDeleteResponse);

  if (videoDeleteResponse.result !== "ok") {
    throw new ApiError(500, "Error deleting video from cloud storage");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);

  if (String(video?.owner) !== String(req?.user?._id)) {
    throw new ApiError(
      401,
      "Unauthorized Request. Only owner can update video details."
    );
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    [{ $set: { isPublished: { $not: "$isPublished" } } }], // aggregation pipeline
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(400, "Invalid video id");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        `Video ${updatedVideo.isPublished ? "Published" : "Unpublished"} successfully`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideoDetails,
  updateVideoThumbnail,
  deleteVideo,
  togglePublishStatus,
};
