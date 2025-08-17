import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateComment,
  deleteComment,
} from "../../../app/features/commentSlice";
import {
  selectIsLoggedIn,
  selectUserData,
} from "../../../app/features/userSlice";
import { openDialog } from "../../../app/features/dialogToggleSlice";
import LikeIcon from "../../../component/iconComponents/LikeIcon";
import BoostIcon from "../../../component/iconComponents/BoostIcon";
import CloseCircleIcon from "../../../component/iconComponents/CloseCircleIcon";

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userData = useSelector(selectUserData);
  const isUpdating = useSelector((state) => state.comment.isUpdating);
  const isDeleting = useSelector((state) => state.comment.isDeleting);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);

  const isOwner = userData?._id === comment.owner._id;
  const timeAgo = getTimeAgo(comment.createdAt);

  const handleEdit = () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
      return;
    }
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    try {
      await dispatch(
        updateComment({ commentId: comment._id, content: editContent.trim() })
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleDelete = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
      return;
    }

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await dispatch(deleteComment(comment._id));
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
    }
    // TODO: Implement comment like functionality
  };

  const handleDislike = () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
    }
    // TODO: Implement comment dislike functionality
  };

  if (isEditing) {
    return (
      <div className="flex gap-x-4">
        <div className="mt-2 h-11 w-11 shrink-0">
          <img
            src={comment.owner.avatar}
            alt={comment.owner.username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="block w-full">
          <div className="mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-[#ae7aff]"
              placeholder="Edit your comment..."
              rows="3"
            />
          </div>
          <div className="flex gap-x-2">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="rounded-lg bg-[#ae7aff] px-3 py-1.5 text-sm font-medium text-black hover:bg-[#9d6aee] disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-x-4">
        <div className="mt-2 h-11 w-11 shrink-0">
          <img
            src={comment.owner.avatar}
            alt={comment.owner.username}
            className="h-full w-full rounded-full"
          />
        </div>
        <div className="block w-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center text-gray-700 dark:text-gray-200">
                {comment.owner.fullName} ·
                <span className="text-sm ml-1">{timeAgo}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                @{comment.owner.username}
              </p>
            </div>
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <CloseCircleIcon className="w-4 h-4" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-full z-10 w-32 rounded-lg bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 p-2 shadow-lg">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full text-left px-2 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
            {comment.content}
          </p>

          {/* Comment Actions */}
          <div className="mt-3 flex items-center gap-x-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-white"
            >
              <LikeIcon filled={comment.isLiked} className="w-4 h-4" />
              <span>{comment.likeCount || 0}</span>
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-white"
            >
              <BoostIcon filled={false} className="w-4 h-4" />
              <span>0</span>
            </button>
            <button className="text-sm text-gray-400 hover:text-white">
              Reply
            </button>
          </div>
        </div>
      </div>
      <hr className="my-4 border-gray-200 dark:border-white/20" />
    </div>
  );
};

// Helper function to format time ago
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

export default CommentItem;
