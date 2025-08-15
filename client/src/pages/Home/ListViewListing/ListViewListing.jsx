import React, { useEffect } from "react";
import ListVideo from "./ListVideo";
import VideoListSkeleton from "../../../component/skeletons/VideoListSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideos,
  selectAllVideos,
  selectIsLoading,
} from "../../../app/features/videoSlice";
import NoVideo from "../NoVideo";

const ListViewListing = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const videos = useSelector(selectAllVideos);

  useEffect(() => {
    let ignore = false;

    async function fetchVideos() {
      await dispatch(getAllVideos());
    }

    if (!ignore) {
      fetchVideos();
    }
    return () => {
      ignore = true;
    };
  }, [dispatch]);

  if (loading) {
    return <VideoListSkeleton count={8} />;
  }

  if (videos.docs.length === 0) {
    return <NoVideo />;
  }

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 p-4">
        {videos.docs.map((video) => (
          <ListVideo key={video._id} {...video} />
        ))}
      </div>
    </section>
  );
};

export default ListViewListing;
