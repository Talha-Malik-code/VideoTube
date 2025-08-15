import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";
import VideoHeaderMeta from "./components/VideoHeaderMeta";
import ActionsBar from "./components/ActionsBar";
import ChannelBar from "./components/ChannelBar";
import DescriptionCollapse from "./components/DescriptionCollapse";
import RecommendedList from "./components/RecommendedList";
import VideoDetailSkeleton from "../../component/skeletons/VideoDetailSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCurrentVideo,
  getVideoById,
  selectCurrentVideo,
  selectIsLiked,
  selectIsLiking,
  selectIsLoading,
  selectIsSubscribed,
  selectIsSubscribing,
  toggleSubscription,
  toggleLike,
  selectSubscriberCount,
  selectLikeCount,
} from "../../app/features/videoSlice";
import VideoNotFound from "./VideoNotFound";

// const sampleData = {
//   _id: "687a4f2887763ab2f6c8fe59",
//   videoFile:
//     "http://res.cloudinary.com/dkvdid6t3/video/upload/v1752846114/r1qk5kabxajg8s9llg41.ts",
//   thumbnail:
//     "http://res.cloudinary.com/dkvdid6t3/image/upload/v1752846116/xuzydiqieuuz2nvsdzt6.jpg",
//   title: "Video3 title",
//   description: "Video3 Description",
//   duration: "0:02",
//   views: 0,
//   isPublished: true,
//   owner: {
//     _id: "687341fbbeb2bbd71ae71dad",
//     username: "talhamalik",
//     fullName: "Talha Malik",
//     avatar:
//       "http://res.cloudinary.com/dkvdid6t3/image/upload/v1752771254/kug5rzzmp97injhnhiwu.jpg",
//     subscribersCount: 2,
//     isSubscribed: false,
//   },
//   createdAt: "2025-07-18T13:42:00.440Z",
//   updatedAt: "2025-07-18T13:42:00.440Z",
//   __v: 0,
//   comments: [],
//   likes: [
//     {
//       _id: "687b7c9cec2c83c48fc2ee67",
//       totalLikes: 1,
//       isLiked: false,
//     },
//   ],
// };

const VideoDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const videoData = useSelector(selectCurrentVideo);
  const isSubscribed = useSelector(selectIsSubscribed);
  const isLiked = useSelector(selectIsLiked);
  const subscriberCount = useSelector(selectSubscriberCount);
  const likeCount = useSelector(selectLikeCount);
  const isSubscribing = useSelector(selectIsSubscribing);
  const isLiking = useSelector(selectIsLiking);
  const loading = useSelector(selectIsLoading);

  console.log("VideoDetail state:", {
    videoData,
    isLiked,
    likeCount,
    isSubscribed,
    subscriberCount,
  });

  const handleSubscriptionToggle = async () => {
    await dispatch(toggleSubscription(videoData.owner._id));
  };

  const handleLikeToggle = async () => {
    await dispatch(toggleLike(id));
  };

  useEffect(() => {
    async function fetchVideoData() {
      await dispatch(getVideoById(id));
    }
    fetchVideoData();

    return () => {
      dispatch(clearCurrentVideo());
    };
  }, [id, dispatch]);

  if (loading) {
    return <VideoDetailSkeleton />;
  }

  if (!videoData) {
    return <VideoNotFound />;
  }

  return (
    <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
      <div className="col-span-12 w-full">
        <VideoPlayer src={videoData.videoFile} />
        <div
          className="group mb-4 w-full rounded-lg border border-gray-200 p-4 duration-200 hover:bg-gray-100/50 focus:bg-gray-100/50 dark:border-white/40 dark:hover:bg-white/5 dark:focus:bg-white/5"
          role="button"
          tabIndex={0}
        >
          <VideoHeaderMeta
            title={videoData.title}
            views={videoData.views}
            duration={videoData.duration}
          />
          <ActionsBar
            likeCount={likeCount}
            boostCount={20}
            isLiked={isLiked}
            isLiking={isLiking}
            onLikeToggle={handleLikeToggle}
          />
          <ChannelBar
            channel={videoData.owner}
            isSubscribed={isSubscribed}
            onSubscriptionToggle={handleSubscriptionToggle}
            isSubscribing={isSubscribing}
            subscriberCount={subscriberCount}
          />
          <hr className="my-4 border-gray-200 dark:border-white" />
          <DescriptionCollapse description={videoData.description} />
        </div>
      </div>
      <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
        <RecommendedList />
      </div>
    </div>
  );
};

export default VideoDetail;
