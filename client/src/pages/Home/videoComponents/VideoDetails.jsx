import React from "react";

const VideoDetails = ({ createdAt, views, className = "" }) => {
  // compare createdAt with current date and time
  const date = new Date(createdAt);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  let timeText = "";
  if (diffDays > 0) {
    timeText = `${diffDays} days ago`;
  } else if (diffHours > 0) {
    timeText = `${diffHours} hours ago`;
  } else if (diffMinutes > 0) {
    timeText = `${diffMinutes} minutes ago`;
  } else {
    timeText = "Just now";
  }

  let viewsText = "";
  if (views > 1000) {
    viewsText = `${(views / 1000).toFixed(1)}k`;
  } else {
    viewsText = views.toString();
  }

  return (
    <p className={`flex text-sm text-gray-600 dark:text-gray-200 ${className}`}>
      {viewsText} views · {timeText}
    </p>
  );
};

export default VideoDetails;
