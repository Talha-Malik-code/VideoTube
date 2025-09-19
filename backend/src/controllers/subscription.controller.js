import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel id is required");
  }

  const subscriptionExists = await Subscription.findOneAndDelete({
    subscriber: req.user?._id,
    channel: channelId,
  });

  let newSubscription;

  if (!subscriptionExists) {
    newSubscription = await Subscription.create({
      subscriber: req.user?._id,
      channel: channelId,
    });
  }

  // only get the subscriber count from the channel
  const channel = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
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
        subscriberCount: {
          $size: "$subscribers",
        },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscription: subscriptionExists ? {} : newSubscription,
        isSubscribed: !subscriptionExists,
        subscriberCount: channel[0]?.subscriberCount || 0,
      },
      `${subscriptionExists ? "Unsubscribed" : "Subscribed"} successfully`
    )
  );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel id is required");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
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
        subscribers: {
          $first: "$subscribers",
        },
      },
    },
    {
      $project: {
        subscribers: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

const getSubscribedChannel = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400, "Subscriber id is required");
  }

  let pipeline = [
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedChannel",
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
              subscriberCount: {
                $size: "$subscribers",
              },
            },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              subscriberCount: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscribedChannel: {
          $first: "$subscribedChannel",
        },
      },
    },
    {
      $project: {
        _id: 0,
        subscribedChannel: 1,
        // subscribedCount: {
        //   $size: "$$ROOT",
        // },
      },
    },
  ];

  if (req?.user?._id && mongoose.isValidObjectId(req?.user?._id)) {
    pipeline = [
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "subscribedChannel",
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
                subscriberCount: {
                  $size: "$subscribers",
                },
                subscribed: {
                  $in: [
                    new mongoose.Types.ObjectId(req?.user?._id),
                    "$subscribers.subscriber",
                  ],
                },
              },
            },
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                subscriberCount: 1,
                subscribed: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          subscribedChannel: {
            $first: "$subscribedChannel",
          },
        },
      },
      {
        $project: {
          _id: 0,
          subscribedChannel: 1,
          // subscribedCount: {
          //   $size: "$$ROOT",
          // },
        },
      },
    ];
  }

  const subscribedChannels = await Subscription.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribedChannels,
        subscribedCount: subscribedChannels.length,
      },
      "Subscribed channel fetched successfully"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannel };
