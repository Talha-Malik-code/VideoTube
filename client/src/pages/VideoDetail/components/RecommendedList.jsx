import React from "react";
import { useNavigate } from "react-router-dom";

const items = [
  {
    id: "1",
    thumb:
      "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "JavaScript Fundamentals: Variables and Data Types",
    duration: "20:45",
    channel: "Code Master",
    meta: "10.3k Views · 44 minutes ago",
  },
  {
    id: "2",
    thumb:
      "https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Getting Started with Express.js",
    duration: "22:18",
    channel: "Express Learner",
    meta: "11.k Views · 5 hours ago",
  },
  {
    id: "3",
    thumb:
      "https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Building a RESTful API with Node.js and Express",
    duration: "24:33",
    channel: "API Builder",
    meta: "14.5k Views · 7 hours ago",
  },
  {
    id: "4",
    thumb:
      "https://images.pexels.com/photos/1739854/pexels-photo-1739854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Introduction to React Native",
    duration: "19:58",
    channel: "React Native Dev",
    meta: "10.9k Views · 8 hours ago",
  },
  {
    id: "5",
    thumb:
      "https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Creating Custom Hooks in React",
    duration: "16:37",
    channel: "Hook Master",
    meta: "9.3k Views · 9 hours ago",
  },
];

const RecommendedList = () => {
  const navigate = useNavigate();

  const handleVideoClick = (videoId, title) => {
    navigate(`/video/${videoId || encodeURIComponent(title)}`);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {items.map((item) => (
        <div
          className="w-full gap-x-2 border border-gray-200 pr-2 md:flex dark:border-white/40 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-md"
          key={item.id}
          onClick={() => handleVideoClick(item.id, item.title)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleVideoClick(item.id, item.title);
            }
          }}
        >
          <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
            <div className="w-full pt-[56%]">
              <div className="absolute inset-0">
                <img
                  src={item.thumb}
                  alt={item.title}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
                {item.duration}
              </span>
            </div>
          </div>
          <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
            <div className="w-full pt-1 md:pt-0">
              <h6 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white hover:text-[#5936D9] dark:hover:text-[#ae7aff] transition-colors">
                {item.title}
              </h6>
              <p className="mb-0.5 mt-2 text-sm text-gray-700 dark:text-gray-200">
                {item.channel}
              </p>
              <p className="flex text-sm text-gray-600 dark:text-gray-200">
                {item.meta}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedList;
