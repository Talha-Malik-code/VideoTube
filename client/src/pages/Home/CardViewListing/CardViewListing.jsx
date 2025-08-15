import React, { useEffect } from "react";
import CardVideo from "./CardVideo";
import VideoCardSkeleton from "../../../component/skeletons/VideoCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideos,
  selectAllVideos,
  selectIsLoading,
} from "../../../app/features/videoSlice";
import NoVideo from "../NoVideo";

const CardViewListing = () => {
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
    return <VideoCardSkeleton count={12} />;
  }

  if (videos.docs.length === 0) {
    return <NoVideo />;
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {videos.docs.map((video) => (
          <CardVideo key={video._id} {...video} />
        ))}
      </div>
    </section>
  );
};

export default CardViewListing;
