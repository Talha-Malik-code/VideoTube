import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVideoComments,
  addComment,
} from "../../../app/features/commentSlice";
import {
  selectIsLoggedIn,
  selectUserData,
} from "../../../app/features/userSlice";
import { openDialog } from "../../../app/features/dialogToggleSlice";
import CommentItem from "./CommentItem";
import CommentIcon from "../../../component/iconComponents/CommentIcon";

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userData = useSelector(selectUserData);
  const comments = useSelector((state) => state.comment.comments);
  const pagination = useSelector((state) => state.comment.pagination);
  const isLoading = useSelector((state) => state.comment.isLoading);
  const isAdding = useSelector((state) => state.comment.isAdding);

  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [openReplyId, setOpenReplyId] = useState(null);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoComments({ videoId }));
    }
  }, [videoId, dispatch]);

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      dispatch(openDialog());
      return;
    }

    if (!commentContent.trim()) return;

    try {
      await dispatch(addComment({ videoId, content: commentContent.trim() }));
      setCommentContent("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleAddReply = async (parentId, content) => {
    if (!isLoggedIn) {
      dispatch(openDialog());
      return;
    }

    if (!content.trim()) return;

    try {
      await dispatch(
        addComment({
          videoId,
          content: content.trim(),
          parentId,
        })
      );
      // Reply will be automatically added to the replies array
      // and the input will be closed by the CommentItem component
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatCommentCount = (count) => {
    if (count === 0) return "No comments yet";
    if (count === 1) return "1 Comment";
    return `${count} Comments`;
  };

  return (
    <div className="w-full">
      {/* Comment Toggle Button (Mobile) */}
      <button
        className="peer w-full rounded-lg border border-gray-200 dark:border-white p-4 text-left duration-200 hover:bg-gray-100/50 dark:hover:bg-white/5 focus:bg-gray-100/50 dark:focus:bg-white/5 sm:hidden"
        onClick={() => setShowComments(!showComments)}
      >
        <h6 className="font-semibold text-gray-900 dark:text-white">
          {formatCommentCount(pagination.totalDocs)}...
        </h6>
      </button>

      {/* Comment Section */}
      <div
        className={`fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border border-gray-200 dark:border-white bg-white dark:bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none ${
          showComments ? "top-[67px]" : ""
        }`}
      >
        <div className="block">
          <h6 className="mb-4 font-semibold text-gray-900 dark:text-white">
            {formatCommentCount(pagination.totalDocs)}
          </h6>

          {/* Comment Input */}
          <div className="mb-4">
            <div className="flex gap-x-3">
              <div className="mt-2 h-11 w-11 shrink-0">
                {userData?.avatar ? (
                  <img
                    src={userData?.avatar}
                    alt={userData?.username || "user"}
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
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M17.5,16.383a8.067,8.067,0,1,1,8.067-8.067A8.076,8.076,0,0,1,17.5,16.383Zm0-13.633a5.567,5.567,0,1,0,5.567,5.566A5.573,5.573,0,0,0,17.5,2.75Z"></path>
                        <path d="M31.477,34.75a1.25,1.25,0,0,1-1.23-1.037A12.663,12.663,0,0,0,17.5,22.852,12.663,12.663,0,0,0,4.753,33.713a1.25,1.25,0,0,1-2.464-.426A15.1,15.1,0,0,1,17.5,20.352,15.1,15.1,0,0,1,32.711,33.287a1.25,1.25,0,0,1-1.02,1.444A1.2,1.2,0,0,1,31.477,34.75Z"></path>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isLoggedIn ? "Add a Comment" : "Sign in to comment"
                  }
                  disabled={!isLoggedIn || isAdding}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/20 bg-transparent px-3 py-2 placeholder-gray-500 dark:placeholder-white/60 text-gray-900 dark:text-white outline-none focus:border-[#ae7aff] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isLoggedIn && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleAddComment}
                      disabled={!commentContent.trim() || isAdding}
                      className="rounded-lg bg-[#ae7aff] px-4 py-2 text-sm font-medium text-black hover:bg-[#9d6aee] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <div className="flex items-center gap-x-2">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Commenting...
                        </div>
                      ) : (
                        "Comment"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200 dark:border-white/20" />

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-x-2">
                <div className="w-5 h-5 border-2 border-gray-600 dark:border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Loading comments...
                </span>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <CommentIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No comments yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                videoId={videoId}
                onReply={() => {}} // Not used anymore
                isReplying={false} // Not used anymore
                replyContent="" // Not used anymore
                setReplyContent={() => {}} // Not used anymore
                onAddReply={handleAddReply}
                onReplyKeyPress={() => {}} // Not used anymore
                onCancelReply={() => {}} // Not used anymore
                openReplyId={openReplyId}
                setOpenReplyId={setOpenReplyId}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {pagination.hasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() =>
                dispatch(
                  getVideoComments({
                    videoId,
                    page: pagination.page + 1,
                    limit: pagination.limit,
                  })
                )
              }
              className="rounded-lg border border-gray-300 dark:border-white/20 px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Load more comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
