import React from "react";

const items = [
  {
    thumb:
      "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "JavaScript Fundamentals: Variables and Data Types",
    duration: "20:45",
    channel: "Code Master",
    meta: "10.3k Views · 44 minutes ago",
  },
  {
    thumb:
      "https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Getting Started with Express.js",
    duration: "22:18",
    channel: "Express Learner",
    meta: "11.k Views · 5 hours ago",
  },
  // ... more items could be added similarly
];

const RecommendedList = () => {
  return (
    <div className="flex w-full flex-col gap-3">
      {items.map((it, idx) => (
        <div
          className="w-full gap-x-2 border border-gray-200 pr-2 md:flex dark:border-white/40"
          key={idx}
        >
          <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
            <div className="w-full pt-[56%]">
              <div className="absolute inset-0">
                <img
                  src={it.thumb}
                  alt={it.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
                {it.duration}
              </span>
            </div>
          </div>
          <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
            <div className="w-full pt-1 md:pt-0">
              <h6 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                {it.title}
              </h6>
              <p className="mb-0.5 mt-2 text-sm text-gray-700 dark:text-gray-200">
                {it.channel}
              </p>
              <p className="flex text-sm text-gray-600 dark:text-gray-200">
                {it.meta}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedList;
