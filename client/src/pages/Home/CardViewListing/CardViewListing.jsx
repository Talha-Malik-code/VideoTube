import React from "react";
import CardVideo from "./CardVideo";

const sampleVideos = [
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "20:45",
    avatarUrl:
      "https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Code Master",
    title: "JavaScript Fundamentals: Variables and Data Types",
    viewsText: "10.3k Views",
    timeText: "44 minutes ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/2519817/pexels-photo-2519817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "22:18",
    avatarUrl:
      "https://images.pexels.com/photos/2519812/pexels-photo-2519812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Express Learner",
    title: "Getting Started with Express.js",
    viewsText: "11.k Views",
    timeText: "5 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "24:33",
    avatarUrl:
      "https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "API Builder",
    title: "Building a RESTful API with Node.js and Express",
    viewsText: "14.5k Views",
    timeText: "7 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1739854/pexels-photo-1739854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "19:58",
    avatarUrl:
      "https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "React Native Dev",
    title: "Introduction to React Native",
    viewsText: "10.9k Views",
    timeText: "8 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1144256/pexels-photo-1144256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "16:37",
    avatarUrl:
      "https://images.pexels.com/photos/1144257/pexels-photo-1144257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Hook Master",
    title: "Creating Custom Hooks in React",
    viewsText: "9.3k Views",
    timeText: "9 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1144260/pexels-photo-1144260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "32:18",
    avatarUrl:
      "https://images.pexels.com/photos/1144269/pexels-photo-1144269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Django Master",
    title: "Building Scalable Web Applications with Django",
    viewsText: "18.9M Views",
    timeText: "12 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1144276/pexels-photo-1144276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "29:30",
    avatarUrl:
      "https://images.pexels.com/photos/1144277/pexels-photo-1144277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "ReactD3",
    title: "Creating Interactive UIs with React and D3",
    viewsText: "20.1k Views",
    timeText: "14 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1144274/pexels-photo-1144274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "26:58",
    avatarUrl:
      "https://images.pexels.com/photos/1144270/pexels-photo-1144270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Passport Pro",
    title: "Node.js Authentication with Passport.js",
    viewsText: "21.2k Views",
    timeText: "15 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1144231/pexels-photo-1144231.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "32:14",
    avatarUrl:
      "https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Tableau Master",
    title: "Data Visualization with Tableau",
    viewsText: "24.5k Views",
    timeText: "18 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1115824/pexels-photo-1115824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "31:55",
    avatarUrl:
      "https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "CSS Animations",
    title: "Advanced CSS: Animations and Transitions",
    viewsText: "28.9k Views",
    timeText: "22 hours ago",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1115808/pexels-photo-1115808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "30:25",
    avatarUrl:
      "https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "React Patterns",
    title: "Advanced React Patterns",
    viewsText: "30.1k Views",
    timeText: "1 day ago",
  },
];

const CardViewListing = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {sampleVideos.map((video, index) => (
          <CardVideo key={index} {...video} />
        ))}
      </div>
    </section>
  );
};

export default CardViewListing;
