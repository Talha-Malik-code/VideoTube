import React, { useEffect } from "react";
import PlaylistHero from "./components/PlaylistHero";
import PlaylistVideoItem from "./components/PlaylistVideoItem";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlaylist,
  selectError,
  selectIsLoading,
  selectPlaylist,
} from "../../app/features/playlistSlice";
import { useParams } from "react-router-dom";
import PlaylistNotFound from "../../component/notFound/PlaylistNotFound";
import PlaylistSkeleton from "./components/PlaylistSkeleton";
import { selectUserData } from "../../app/features/userSlice";
import EditPlaylistDialog from "./components/EditPlaylistDialog";

const STATIC_VIDEOS = [
  {
    id: "1",
    thumbnail:
      "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "JavaScript Fundamentals: Variables and Data Types",
    duration: "20:45",
    avatar:
      "https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "Code Master",
    stats: "10.3k Views · 44 minutes ago",
  },
  {
    id: "2",
    thumbnail:
      "https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Getting Started with Express.js",
    duration: "22:18",
    avatar:
      "https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "Express Learner",
    stats: "11.k Views · 5 hours ago",
  },
  {
    id: "3",
    thumbnail:
      "https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Building a RESTful API with Node.js and Express",
    duration: "24:33",
    avatar:
      "https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "API Builder",
    stats: "14.5k Views · 7 hours ago",
  },
  {
    id: "4",
    thumbnail:
      "https://images.pexels.com/photos/1739854/pexels-photo-1739854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Introduction to React Native",
    duration: "19:58",
    avatar:
      "https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "React Native Dev",
    stats: "10.9k Views · 8 hours ago",
  },
  {
    id: "5",
    thumbnail:
      "https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Creating Custom Hooks in React",
    duration: "16:37",
    avatar:
      "https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "Hook Master",
    stats: "9.3k Views · 9 hours ago",
  },
  {
    id: "6",
    thumbnail:
      "https://images.pexels.com/photos/1144260/pexels-photo-1144260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Building Scalable Web Applications with Django",
    duration: "32:18",
    avatar:
      "https://images.pexels.com/photos/1144269/pexels-photo-1144269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "Django Master",
    stats: "18.9M Views · 12 hours ago",
  },
  {
    id: "7",
    thumbnail:
      "https://images.pexels.com/photos/1144276/pexels-photo-1144276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Creating Interactive UIs with React and D3",
    duration: "29:30",
    avatar:
      "https://images.pexels.com/photos/1144277/pexels-photo-1144277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "ReactD3",
    stats: "20.1k Views · 14 hours ago",
  },
  {
    id: "8",
    thumbnail:
      "https://images.pexels.com/photos/1144274/pexels-photo-1144274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Node.js Authentication with Passport.js",
    duration: "26:58",
    avatar:
      "https://images.pexels.com/photos/1144270/pexels-photo-1144270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "Passport Pro",
    stats: "21.2k Views · 15 hours ago",
  },
  {
    id: "9",
    thumbnail:
      "https://images.pexels.com/photos/1115808/pexels-photo-1115808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Advanced React Patterns",
    duration: "30:25",
    avatar:
      "https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channel: "React Patterns",
    stats: "30.1k Views · 1 day ago",
  },
];

const Playlist = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const playlist = useSelector(selectPlaylist);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const user = useSelector(selectUserData);
  const isOwner =
    user?._id && playlist?.owner?._id && user._id === playlist.owner._id;
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  useEffect(() => {
    dispatch(getPlaylist(id));
  }, [dispatch, id]);

  console.log(playlist);

  if (isLoading || playlist.isNotFetched) {
    return <PlaylistSkeleton items={6} />;
  }

  if (error) {
    return <PlaylistNotFound title="Error loading playlist" text={error} />;
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
      <div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
        <PlaylistHero playlist={playlist} onEdit={() => setIsEditOpen(true)} />
      </div>
      <div className="flex w-full flex-col gap-y-4">
        {!playlist ||
        !Array.isArray(playlist.videos) ||
        playlist.videos.length === 0 ? (
          <PlaylistNotFound
            title="No videos in this playlist"
            text="This playlist does not contain any videos yet."
          />
        ) : (
          playlist.videos.map((video) => (
            <div
              key={video._id}
              className="border dark:bg-transparent bg-white"
            >
              <PlaylistVideoItem video={video} />
            </div>
          ))
        )}
      </div>
      {isOwner && isEditOpen && (
        <EditPlaylistDialog
          playlist={playlist}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
};

export default Playlist;
