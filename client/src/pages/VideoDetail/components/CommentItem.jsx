import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getVideoComments,
  selectReplies,
  selectReplyPagination,
  selectIsGettingReplies,
  updateComment,
  deleteComment,
  selectIsUpdatingComment,
  selectIsDeletingComment,
  selectCommentOrReplyById,
} from "../../../app/features/commentSlice";
import {
  toggleCommentLike,
  selectCommentLikeState,
  initializeCommentLikeState,
  selectIsLiking,
} from "../../../app/features/likeSlice";
import {
  toggleCommentDislike,
  selectCommentDislikeState,
  initializeCommentDislikeState,
  selectIsDisliking,
} from "../../../app/features/dislikeSlice";
import {
  selectIsLoggedIn,
  selectUserData,
} from "../../../app/features/userSlice";
import { openDialog } from "../../../app/features/dialogToggleSlice";
import { formatDistanceToNow } from "date-fns";

const CommentItem = ({
  commentId,
  videoId,
  onAddReply,
  openReplyId,
  setOpenReplyId,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userData = useSelector(selectUserData);

  const comment = useSelector((state) =>
    selectCommentOrReplyById(state, commentId)
  );

  // Get replies for this comment
  const replies = useSelector((state) => selectReplies(state, commentId)); // Use commentId directly here
  const replyPagination = useSelector(
    (state) => selectReplyPagination(state, commentId) // Use commentId directly here
  );
  const isGettingReplies = useSelector(
    (state) => selectIsGettingReplies(state, commentId) // Use commentId directly here
  );

  // Get loading states
  const isUpdating = useSelector(selectIsUpdatingComment);
  const isDeleting = useSelector(
    (state) => selectIsDeletingComment(state, commentId) // Use commentId directly here
  );

  // Get like/dislike state
  const { isLiked, likeCount } = useSelector(
    (state) => selectCommentLikeState(state, commentId) // Use commentId directly here
  );
  const { isDisliked, dislikeCount } = useSelector(
    (state) => selectCommentDislikeState(state, commentId) // Use commentId directly here
  );
  const isDisliking = useSelector(selectIsDisliking);
  const isLiking = useSelector(selectIsLiking);

  const [showReplies, setShowReplies] = useState(false);
  const [localReplyContent, setLocalReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(""); // Initialize with empty string to avoid "undefined" error if comment is null
  // State for the custom delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Return null if the comment is not there
  if (!comment) {
    return null;
  }

  // Initialize like/dislike state for this comment
  useEffect(() => {
    if (comment) {
      dispatch(
        initializeCommentLikeState({
          commentId: comment._id,
          isLiked: comment.isLiked || false,
          likeCount: comment.likeCount || 0,
        })
      );

      dispatch(
        initializeCommentDislikeState({
          commentId: comment._id,
          isDisliked: comment.isDisliked || false,
          dislikeCount: comment.dislikeCount || 0,
        })
      );
    }
  }, [comment, dispatch]);

  // Update edit content when comment content changes in the store, but NOT while editing
  useEffect(() => {
    if (!isEditing) {
      setEditContent(comment.content);
    }
  }, [comment.content, isEditing]);

  useEffect(() => {
    // Load replies when showReplies is true and they haven't been loaded yet
    if (showReplies && comment.replyCount > 0 && replies.length === 0) {
      dispatch(
        getVideoComments({
          videoId: id,
          parentId: comment._id,
          page: 1,
          limit: 10,
        })
      );
    }
  }, [
    showReplies,
    comment.replyCount,
    replies.length,
    dispatch,
    comment._id,
    id,
  ]);

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog("auth"));
      return;
    }
    await dispatch(toggleCommentLike(comment._id));
    if (isDisliked) {
      await dispatch(toggleCommentDislike(comment._id));
    }
  };

  const handleDislikeToggle = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog("auth"));
      return;
    }
    await dispatch(toggleCommentDislike(comment._id));
    if (isLiked) {
      await dispatch(toggleCommentLike(comment._id));
    }
  };

  const handleReplyClick = () => {
    if (!isLoggedIn) {
      dispatch(openDialog("auth"));
      return;
    }
    // Toggle the reply input for this comment
    if (openReplyId !== comment._id) {
      setOpenReplyId(comment._id);
      setLocalReplyContent("");
    } else {
      setOpenReplyId(null);
      setLocalReplyContent("");
    }
  };

  const handleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleLoadMoreReplies = () => {
    if (replyPagination.hasNextPage) {
      dispatch(
        getVideoComments({
          videoId: id,
          parentId: comment._id,
          page: replyPagination.page + 1,
          limit: replyPagination.limit,
        })
      );
    }
  };

  const handleAddReply = () => {
    if (!localReplyContent.trim()) return;
    onAddReply(comment._id, localReplyContent);
    setLocalReplyContent("");
    setOpenReplyId(null);
    if (!showReplies) setShowReplies(true);
  };

  const handleCancelReply = () => {
    setLocalReplyContent("");
    setOpenReplyId(null);
  };

  const handleReplyKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddReply();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent === comment.content) {
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

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteComment(comment._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const canEdit = userData?._id === comment.owner._id;
  const canDelete = userData?._id === comment.owner._id;
  const isReplyInputOpen = openReplyId === comment._id;

  return (
    <div className="space-y-3">
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#121212] p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this comment? This will also
              delete all replies.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md dark:text-gray-300 dark:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Comment */}
      <div className="flex gap-x-3">
        <div className="mt-2 h-10 w-10 shrink-0">
          {comment.owner?.avatar ? (
            <img
              src={comment.owner.avatar}
              alt={comment.owner.username || "user"}
              className="h-full w-full rounded-full"
            />
          ) : (
            <div className="flex w-full h-full items-start justify-start">
              <svg
                fill="#fff"
                className="h-8 w-8 rounded-full"
                viewBox="0 0 35 35"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.5,16.383a8.067,8.067,0,1,1,8.067-8.067A8.076,8.076,0,0,1,17.5,16.383Zm0-13.633a5.567,5.567,0,1,0,5.567,5.566A5.573,5.573,0,0,0,17.5,2.75Z"></path>
                <path d="M31.477,34.75a1.25,1.25,0,0,1-1.23-1.037A12.663,12.663,0,0,0,17.5,22.852,12.663,12.663,0,0,0,4.753,33.713a1.25,1.25,0,0,1-2.464-.426A15.1,15.1,0,0,1,17.5,20.352,15.1,15.1,0,0,1,32.711,33.287a1.25,1.25,0,0,1-1.02,1.444A1.2,1.2,0,0,1,31.477,34.75Z"></path>
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-x-2 mb-1">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {comment.owner?.fullName ||
                comment.owner?.username ||
                "Unknown User"}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Comment Content or Edit Input */}
          {isEditing ? (
            <div className="mb-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyPress={handleEditKeyPress}
                className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#ae7aff] text-sm"
                disabled={isUpdating}
              />
              <div className="mt-2 flex gap-x-2">
                <button
                  onClick={handleEditSave}
                  disabled={
                    !editContent.trim() ||
                    editContent === comment.content ||
                    isUpdating
                  }
                  className="rounded-lg bg-[#ae7aff] px-3 py-1 text-xs font-medium text-black hover:bg-[#9d6aee] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={isUpdating}
                  className="rounded-lg border border-gray-300 dark:border-white/20 px-3 py-1 text-xs text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white text-sm mb-2">
              {comment.content}
            </p>
          )}

          {/* Comment Actions */}
          <div className="flex items-center gap-x-4 text-xs">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-x-1 hover:text-[#ae7aff] transition-colors ${
                isLiked
                  ? "text-[#5936D9] dark:text-[#ae7aff]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              disabled={isLiking || isDisliking}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {likeCount}
            </button>

            <button
              onClick={handleDislikeToggle}
              className={`flex items-center gap-x-1 hover:text-[#ae7aff] transition-colors ${
                isDisliked
                  ? "text-[#5936D9] dark:text-[#ae7aff]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              disabled={isLiking || isDisliking}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              {dislikeCount}
            </button>

            <button
              onClick={handleReplyClick}
              className="text-gray-500 dark:text-gray-400 hover:text-[#ae7aff] transition-colors"
            >
              Reply
            </button>

            {canEdit && !isEditing && (
              <button
                onClick={handleEditClick}
                className="text-gray-500 dark:text-gray-400 hover:text-[#ae7aff] transition-colors"
              >
                Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {isReplyInputOpen && (
            <div className="mt-3 flex gap-x-3">
              <div className="mt-2 h-8 w-8 shrink-0">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt={userData.username || "user"}
                    className="h-full w-full rounded-full"
                  />
                ) : (
                  <div className="flex w-full h-full items-start justify-start">
                    <svg
                      fill="#fff"
                      className="h-6 w-6 rounded-full"
                      viewBox="0 0 35 35"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,16.383a8.067,8.067,0,1,1,8.067-8.067A8.076,8.076,0,0,1,17.5,16.383Zm0-13.633a5.567,5.567,0,1,0,5.567,5.566A5.573,5.573,0,0,0,17.5,2.75Z"></path>
                      <path d="M31.477,34.75a1.25,1.25,0,0,1-1.23-1.037A12.663,12.663,0,0,0,17.5,22.852,12.663,12.663,0,0,0,4.753,33.713a1.25,1.25,0,0,1-2.464-.426A15.1,15.1,0,0,1,17.5,20.352,15.1,15.1,0,0,1,32.711,33.287a1.25,1.25,0,0,1-1.02,1.444A1.2,1.2,0,0,1,31.477,34.75Z"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={localReplyContent}
                  onChange={(e) => setLocalReplyContent(e.target.value)}
                  onKeyPress={handleReplyKeyPress}
                  placeholder="Write a reply..."
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 placeholder-gray-500 dark:placeholder-white/60 text-gray-900 dark:text-white outline-none focus:border-[#ae7aff] text-sm"
                />
                <div className="mt-2 flex gap-x-2">
                  <button
                    onClick={handleAddReply}
                    disabled={!localReplyContent.trim()}
                    className="rounded-lg bg-[#ae7aff] px-3 py-1 text-xs font-medium text-black hover:bg-[#9d6aee] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                  <button
                    onClick={handleCancelReply}
                    className="rounded-lg border border-gray-300 dark:border-white/20 px-3 py-1 text-xs text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies Section */}
      {comment.replyCount > 0 && (
        <div className="ml-12">
          <div className="flex items-center gap-x-2 mb-2">
            <button
              onClick={handleShowReplies}
              className="text-sm text-[#ae7aff] hover:underline"
            >
              {showReplies ? "Hide" : "Show"} {comment.replyCount}{" "}
              {comment.replyCount === 1 ? "reply" : "replies"}
            </button>

            {/* Loading indicator for replies */}
            {isGettingReplies && (
              <div className="flex items-center gap-x-1">
                <div className="w-3 h-3 border border-[#ae7aff] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-[#ae7aff]">Loading...</span>
              </div>
            )}
          </div>

          {showReplies && (
            <div className="space-y-3">
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  commentId={reply._id}
                  videoId={videoId}
                  onAddReply={onAddReply}
                  openReplyId={openReplyId}
                  setOpenReplyId={setOpenReplyId}
                />
              ))}

              {replyPagination.hasNextPage && (
                <button
                  onClick={handleLoadMoreReplies}
                  disabled={isGettingReplies}
                  className="text-sm text-[#ae7aff] hover:underline disabled:opacity-50"
                >
                  {isGettingReplies ? "Loading..." : "Load more replies"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
