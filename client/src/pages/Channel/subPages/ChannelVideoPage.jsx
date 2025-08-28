import React from "react";
import CardVideo from "../../Home/CardViewListing/CardVideo";
import NoVideo from "../../Home/NoVideo";
import Button from "../../../component/Button";
import PlusIcon from "../../../component/iconComponents/PlusIcon";
import { useDispatch } from "react-redux";
import { openDialog } from "../../../app/features/dialogToggleSlice";

const ChannelVideoPage = ({ videos, isEditable }) => {
  const dispatch = useDispatch();

  function openUploadVideoDialog() {
    dispatch(openDialog("uploadVideo"));
  }

  if (!videos?.length) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <NoVideo
          title="No videos uploaded"
          text="This page has yet to upload a video. Search another page in order to find more videos."
        />
        {isEditable && (
          <Button
            onClick={openUploadVideoDialog}
            className="mt-4 inline-flex items-center gap-x-2 !px-3 !py-2 font-semibold"
          >
            {/* <span className="flex gap-1"> */}
            <PlusIcon />
            <span>New Video</span>
            {/* </span> */}
          </Button>
        )}
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {videos.map((video) => (
          <CardVideo key={video._id} {...video} />
        ))}
      </div>
    </section>
  );
};

export default ChannelVideoPage;
