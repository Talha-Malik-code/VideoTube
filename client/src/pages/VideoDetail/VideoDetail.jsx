import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";
import VideoHeaderMeta from "./components/VideoHeaderMeta";
import ActionsBar from "./components/ActionsBar";
import ChannelBar from "./components/ChannelBar";
import DescriptionCollapse from "./components/DescriptionCollapse";
import CommentSection from "./components/CommentSection";
import RecommendedList from "./components/RecommendedList";
import VideoDetailSkeleton from "../../component/skeletons/VideoDetailSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCurrentVideo,
  getVideoById,
  selectCurrentVideo,
  selectIsSubscribed,
  selectIsSubscribing,
  toggleSubscription,
  selectSubscriberCount,
} from "../../app/features/videoSlice";
import {
  toggleVideoLike,
  selectVideoLikeState,
  selectIsLiking,
  initializeVideoLikeState,
} from "../../app/features/likeSlice";
import {
  toggleVideoDislike,
  selectVideoDislikeState,
  selectIsDisliking,
  initializeVideoDislikeState,
} from "../../app/features/dislikeSlice";
import VideoNotFound from "./VideoNotFound";
import { selectIsLoggedIn } from "../../app/features/userSlice";
import { openDialog } from "../../app/features/dialogToggleSlice";

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
  const subscriberCount = useSelector(selectSubscriberCount);
  const isSubscribing = useSelector(selectIsSubscribing);
  const loading = useSelector((state) => state.video.isLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Get like/dislike state from the new slices
  const { isLiked, likeCount } = useSelector((state) =>
    selectVideoLikeState(state, id)
  );
  const { isDisliked, dislikeCount } = useSelector((state) =>
    selectVideoDislikeState(state, id)
  );
  const isLiking = useSelector(selectIsLiking);
  const isDisliking = useSelector(selectIsDisliking);

  console.log("VideoDetail state:", {
    videoData,
    isLiked,
    likeCount,
    isSubscribed,
    subscriberCount,
    isDisliked,
    dislikeCount,
    isDisliking,
  });

  const handleSubscriptionToggle = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
    } else {
      await dispatch(toggleSubscription(videoData.owner._id));
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
    } else {
      await dispatch(toggleVideoLike(id));
      if (isDisliked) {
        await dispatch(toggleVideoDislike(id));
      }
    }
  };

  const handleDislikeToggle = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
    } else {
      await dispatch(toggleVideoDislike(id));
      if (isLiked) {
        await dispatch(toggleVideoLike(id));
      }
    }
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

  // Initialize like/dislike state when video data is loaded
  useEffect(() => {
    if (videoData) {
      // Initialize like state
      dispatch(
        initializeVideoLikeState({
          videoId: id,
          isLiked: videoData.isLiked || false,
          likeCount: videoData.totalLikes || 0,
        })
      );

      // Initialize dislike state
      dispatch(
        initializeVideoDislikeState({
          videoId: id,
          isDisliked: videoData.isDisliked || false,
          dislikeCount: videoData.totalDislikes || 0,
        })
      );
    }
  }, [videoData, id, dispatch]);

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
          className="group mb-4 w-full rounded-lg border border-gray-200 bg-white p-4 duration-200 hover:bg-gray-100/50 focus:bg-gray-100/50 dark:border-white dark:bg-[#121212] dark:hover:bg-white/5 dark:focus:bg-white/5"
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
            isLiked={isLiked}
            isLiking={isLiking}
            onLikeToggle={handleLikeToggle}
            onDislikeToggle={handleDislikeToggle}
            isDisliked={isDisliked}
            isDisliking={isDisliking}
            dislikeCount={dislikeCount}
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

        {/* Comment Section */}
        <CommentSection videoId={id} />
      </div>
      <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
        <RecommendedList />
      </div>
    </div>
  );
};

export default VideoDetail;
