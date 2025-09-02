import React, { useEffect } from "react";
import NoVideo from "../Home/NoVideo";
import AButton from "../../component/AButton";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
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
import EditProfileInfoPage from "./subPages/EditProfileInfoPage";
import EditChannelInfoPage from "./subPages/EditChannelInfoPage";
import ChangePasswordPage from "./subPages/ChangePasswordPage";
import { selectUserData } from "../../app/features/userSlice";
import ChannelNotFound from "../../component/notFound/ChannelNotFound";
import ChannelPlaylistPage from "./subPages/ChannelPlaylistPage";
import ChannelSubscribedListPage from "./subPages/ChannelSubscribedListPage";
import ChannelTweetsPage from "./subPages/ChannelTweetsPage";

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
    let ignore = false;

    async function fetchChannelData() {
      await dispatch(getChannelData(username));
    }

    if (!ignore) {
      fetchChannelData();
    }

    return () => {
      ignore = true;
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
      subpageComponent = <EditChannelInfoPage />;
    } else if (subpage === "change_password") {
      subpageComponent = <ChangePasswordPage />;
    } else {
      subpageComponent = <EditProfileInfoPage />;
    }
  } else {
    if (subpage === "playlists") {
      subpageComponent = <ChannelPlaylistPage />;
    } else if (subpage === "tweets") {
      subpageComponent = <ChannelTweetsPage />;
    } else if (subpage === "subscribed") {
      subpageComponent = <ChannelSubscribedListPage />;
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
      <CoverImage
        username={username}
        coverImage={coverImage}
        isEditable={isEditable}
      />
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
        <div className="min-h-[34.2rem] p-4">{subpageComponent}</div>
      </div>
    </>
  );
};

export default Channel;
