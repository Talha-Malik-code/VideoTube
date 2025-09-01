import React, { useEffect } from "react";
import CardVideo from "./CardVideo";
import VideoCardSkeleton from "../../../component/skeletons/VideoCardSkeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideos,
  selectAllVideos,
  selectError,
  selectIsLoading,
} from "../../../app/features/videoSlice";
import NoVideo from "../NoVideo";
import WarningError from "../../../component/notFound/WarningError";

const CardViewListing = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const videos = useSelector(selectAllVideos);
  const error = useSelector(selectError);

  console.log("Error: ", error);

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

  if (error) {
    return <WarningError title="Error fetching videos" text={error} />;
  }

  if (loading && videos?.isNotFetched) {
    return <VideoCardSkeleton count={12} />;
  }

  console.log("videos: ", videos);
  console.log("videos?.docs: ", videos?.docs);
  console.log("videos?.docs.length: ", videos?.docs.length);
  if (videos?.docs && videos?.docs.length === 0) {
    return <NoVideo />;
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {videos?.docs?.map((video) => (
          <CardVideo key={video._id} {...video} />
        ))}
      </div>
    </section>
  );
};

export default CardViewListing;
