import React, { useEffect } from "react";
import NoVideo from "../Home/NoVideo";
import AButton from "../../component/AButton";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  cleanChannelData,
  getUserVideos,
  selectChannelData,
  selectIsLoading,
} from "../../app/features/channelSlice";
import ChannelSkeleton from "../../component/skeletons/ChannelSkeleton";
import CoverImage from "./components/CoverImage";
import ChannelInfoSection from "./components/ChannelInfoSection";
import ToggleBarSection from "./components/ToggleBarSection";
import ChannelVideoPage from "./subPages/ChannelVideoPage";
import { selectUserData } from "../../app/features/userSlice";

const Channel = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const user = useSelector(selectUserData);
  const isLoading = useSelector(selectIsLoading);
  const channelData = useSelector(selectChannelData);
  const isLoggedInUserChannel = user?.username === username;

  useEffect(() => {
    async function fetchChannelData() {
      await dispatch(getUserVideos(username));
    }

    fetchChannelData();

    return () => {
      dispatch(cleanChannelData());
    };
  }, [dispatch, username]);

  const coverImage = channelData?.coverImage;
  const profileImage = channelData?.avatar || "../AvatarPH.png";

  if (isLoading) {
    return <ChannelSkeleton />;
  }

  return (
    <>
      <CoverImage coverImage={coverImage} isEditable={isLoggedInUserChannel} />
      <div className="bg-white px-4 pb-4 dark:bg-[#121212]">
        <ChannelInfoSection
          channelData={channelData}
          profileImage={profileImage}
          isEditable={isLoggedInUserChannel}
        />
        <ToggleBarSection />
        <div className="flex justify-center items-center min-h-[34.2rem] p-4">
          <ChannelVideoPage
            videos={channelData.videos}
            isEditable={isLoggedInUserChannel}
          />
        </div>
      </div>
    </>
  );
};

export default Channel;
