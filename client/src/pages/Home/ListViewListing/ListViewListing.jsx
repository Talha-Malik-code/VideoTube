import React from "react";
import ListVideo from "./ListVideo";

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
    description:
      "Learn the basics of JavaScript, including variables, data types, and how to use them in your programs.",
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
    description:
      "Learn the basics of building web applications with Node.js and Express.js framework.",
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
    description:
      "Learn how to create a RESTful API using Node.js and the Express framework for building web applications.",
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
    description:
      "Discover how to build mobile applications using React Native for both Android and iOS platforms.",
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
    description:
      "Learn how to create and use custom hooks to share logic across multiple React components.",
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
    description:
      "Learn how to build robust and scalable web applications using the Django framework for Python.",
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
    description:
      "Learn how to build dynamic and interactive user interfaces with React and the D3.js data visualization library.",
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
    description:
      "Learn how to implement user authentication in Node.js applications using the Passport.js middleware.",
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
    description:
      "Learn how to create stunning visualizations and dashboards using Tableau for data analysis.",
  },
  {
    thumbnailUrl:
      "https://images.pexels.com/photos/1144250/pexels-photo-1144250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    duration: "27:37",
    avatarUrl:
      "https://images.pexels.com/photos/18264716/pexels-photo-18264716/free-photo-of-man-people-laptop-internet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    channelName: "Socket.IO Expert",
    title: "Building Real-Time Applications with Socket.IO",
    viewsText: "25.6k Views",
    timeText: "19 hours ago",
    description:
      "Learn how to create real-time applications using Socket.IO for seamless communication between clients and servers.",
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
    description:
      "Learn how to create captivating animations and transitions using CSS for dynamic web experiences.",
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
    description:
      "Explore advanced patterns and techniques for building scalable and maintainable React applications.",
  },
];

const ListViewListing = () => {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 p-4">
        {sampleVideos.map((video, index) => (
          <ListVideo key={index} {...video} />
        ))}
      </div>
    </section>
  );
};

export default ListViewListing;
