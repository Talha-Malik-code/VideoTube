import React, { useEffect } from "react";
import NoVideo from "../Home/NoVideo";
import AButton from "../../component/AButton";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  cleanChannelData,
  getChannelData,
  selectChannelData,
  selectError,
  selectIsLoading,
} from "../../app/features/channelSlice";
import ChannelSkeleton from "../../component/skeletons/ChannelSkeleton";
import CoverImage from "./components/CoverImage";
import ChannelInfoSection from "./components/ChannelInfoSection";
import ToggleBarSection from "./components/ToggleBarSection";
import ChannelVideoPage from "./subPages/ChannelVideoPage";
import { selectUserData } from "../../app/features/userSlice";
import ChannelNotFound from "../../component/notFound/ChannelNotFound";

const Channel = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const user = useSelector(selectUserData);
  const isLoading = useSelector(selectIsLoading);
  const channelData = useSelector(selectChannelData);
  const error = useSelector(selectError);
  const isLoggedInUserChannel = user?.username === username;
  const [searchParams] = useSearchParams();

  const subpage = searchParams.get("subpage");
  const isEditable =
    searchParams.get("edit") === "true" && isLoggedInUserChannel;

  useEffect(() => {
    async function fetchChannelData() {
      await dispatch(getChannelData(username));
    }

    fetchChannelData();

    return () => {
      dispatch(cleanChannelData());
    };
  }, [dispatch, username]);

  const coverImage = channelData?.coverImage;
  const profileImage = channelData?.avatar || "../AvatarPH.png";

  if (error) {
    return (
      <ChannelNotFound
        title="Channel not found"
        text="The channel you are looking for does not exist. Please try to search for another channel."
      />
    );
  }

  if (isLoading || !channelData?._id) {
    return <ChannelSkeleton />;
  }

  let subpageComponent = null;

  if (isEditable) {
    if (subpage === "edit_channel") {
      subpageComponent = <h1>Edit Channel</h1>;
    } else if (subpage === "change_password") {
      subpageComponent = <h1>Change Password</h1>;
    } else {
      subpageComponent = <h1>Edit Profile</h1>;
    }
  } else {
    if (subpage === "playlists") {
      subpageComponent = <h1>Playlists</h1>;
    } else if (subpage === "tweets") {
      subpageComponent = <h1>Tweets</h1>;
    } else if (subpage === "subscribed") {
      subpageComponent = <h1>Subscribed Channels</h1>;
    } else {
      subpageComponent = (
        <ChannelVideoPage
          isMyChannel={isLoggedInUserChannel}
          channelId={channelData?._id}
        />
      );
    }
  }

  return (
    <>
      <CoverImage coverImage={coverImage} isEditable={isEditable} />
      <div className="bg-white px-4 pb-4 dark:bg-[#121212]">
        <ChannelInfoSection
          username={username}
          channelData={channelData}
          profileImage={profileImage}
          isMyChannel={isLoggedInUserChannel}
          isEditable={isEditable}
        />
        <ToggleBarSection
          username={username}
          isEditable={isEditable}
          subpage={subpage}
        />
        <div className="flex justify-center items-center min-h-[34.2rem] p-4">
          {subpageComponent}
        </div>
      </div>
    </>
  );
};

export default Channel;
