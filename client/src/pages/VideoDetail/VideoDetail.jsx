import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";
import VideoHeaderMeta from "./components/VideoHeaderMeta";
import ActionsBar from "./components/ActionsBar";
import ChannelBar from "./components/ChannelBar";
import DescriptionCollapse from "./components/DescriptionCollapse";
import RecommendedList from "./components/RecommendedList";

const VideoDetail = () => {
  const { id } = useParams();
  // Static demo data from provided page (replace with real data later). id is accessible if needed.
  const video = {
    src: "https://res.cloudinary.com/dfw5nnic5/video/upload/v1695117968/Sample_1280x720_mp4_b4db0s.mp4",
    title: "Advanced React Patterns",
    viewsText: "30,164 Views",
    timeText: "18 hours ago",
    channel: {
      name: "React Patterns",
      avatar:
        "https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      subscribers: "757K Subscribers",
    },
    description:
      '🚀 Dive into the world of React with our latest tutorial series: "Advanced React Patterns"! 🛠️ Whether you\'re a seasoned developer or just starting out, this series is designed to elevate your React skills to the next level.',
  };

  return (
    <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
      <div className="col-span-12 w-full">
        <VideoPlayer src={video.src} />
        <div
          className="group mb-4 w-full rounded-lg border border-gray-200 p-4 duration-200 hover:bg-gray-100/50 focus:bg-gray-100/50 dark:border-white/40 dark:hover:bg-white/5 dark:focus:bg-white/5"
          role="button"
          tabIndex={0}
        >
          <VideoHeaderMeta
            title={video.title}
            viewsText={video.viewsText}
            timeText={video.timeText}
          />
          <ActionsBar likeCount={3050} boostCount={20} />
          <ChannelBar channel={video.channel} />
          <hr className="my-4 border-gray-200 dark:border-white" />
          <DescriptionCollapse description={video.description} />
        </div>
      </div>
      <div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
        <RecommendedList />
      </div>
    </div>
  );
};

export default VideoDetail;
