import React from "react";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../app/features/userSlice";
import { openDialog } from "../app/features/dialogToggleSlice";
import {
  selectIsSubscribing,
  toggleSubscription,
  updateIsSubscribedInSubscribedChannels,
} from "../app/features/channelSlice";

const SubscribedChannelCard = ({ channel, isSubscribed, className = "" }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isSubscribing = useSelector(selectIsSubscribing);
  const { _id, fullName, avatar, subscriberCount = 0, username } = channel;

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleSubscribeToggle = async () => {
    console.log("Button clicked");
    if (!isLoggedIn) {
      dispatch(openDialog("auth"));
    } else {
      const result = await dispatch(toggleSubscription(_id));
      console.log("result.payload.isSubscribed", result.payload.isSubscribed);
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(
          updateIsSubscribedInSubscribedChannels({
            channelUsername: username,
            isSubscribed: result.payload.isSubscribed,
          })
        );
      }
    }
  };

  console.log("isSubscribed in SubscribedChannelCard", isSubscribed);

  return (
    <div className={`flex w-full justify-between ${className}`}>
      <div className="flex items-center gap-x-2">
        <div className="h-14 w-14 shrink-0">
          <img
            src={
              avatar ||
              "https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt={fullName}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="block">
          <h6 className="font-semibold text-black dark:text-white">
            {fullName}
          </h6>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatSubscriberCount(subscriberCount)} Subscribers
          </p>
        </div>
      </div>
      <div className="block">
        <Button
          className={`px-3 py-2 text-black ${
            isSubscribing ? "opacity-50" : ""
          } ${isSubscribed ? "" : "dark:bg-white bg-[#ae7aff]"}`}
          onClick={handleSubscribeToggle}
          disabled={isSubscribing}
        >
          <span>
            {isSubscribing
              ? "Subscribing..."
              : isSubscribed
              ? "Subscribed"
              : "Subscribe"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SubscribedChannelCard;
