import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData } from "../../utils";

const initialState = {
  comments: [],
  replies: {},
  pagination: {
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  replyPagination: {},
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: {},
  isGettingReplies: {},
  error: null,
};

export const getVideoComments = createAsyncThunk(
  "comment/getVideoComments",
  async (
    { videoId, page = 1, limit = 10, parentId = null },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = `page=${page}&limit=${limit}${
        parentId ? `&parentId=${parentId}` : ""
      }`;
      const data = await fetchData(`comment/${videoId}?${queryParams}`, {
        credentials: "include",
      });
      return { data, parentId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const getCommentReplies = createAsyncThunk(
  "comment/getCommentReplies",
  async ({ commentId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        `comment/replies/${commentId}?page=${page}&limit=${limit}`,
        {
          credentials: "include",
        }
      );
      return { commentId, data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch replies"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ videoId, content, parentId = null }, { rejectWithValue }) => {
    try {
      const data = await updateData(
        `comment/${videoId}`,
        { content, parentId },
        "POST"
      );
      return { data, parentId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const data = await updateData(
        `comment/c/${commentId}`,
        { content },
        "PATCH"
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/comment/c/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return commentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.replies = {};
      state.pagination = initialState.pagination;
      state.replyPagination = {};
      state.isGettingReplies = {};
      state.isDeleting = {};
      state.isUpdating = false;
      state.isAdding = false;
    },
    setCommentPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setReplyPage: (state, action) => {
      const { commentId, page } = action.payload;
      if (!state.replyPagination[commentId]) {
        state.replyPagination[commentId] = { ...initialState.pagination };
      }
      state.replyPagination[commentId].page = page;
    },
    clearReplies: (state, action) => {
      const commentId = action.payload;
      if (commentId) {
        delete state.replies[commentId];
        delete state.replyPagination[commentId];
        delete state.isGettingReplies[commentId];
        delete state.isDeleting[commentId];
      } else {
        state.replies = {};
        state.replyPagination = {};
        state.isGettingReplies = {};
        state.isDeleting = {};
      }
    },
    initializeCommentLikeState: () => {
      // This will be handled by the like/dislike slices
    },
  },
  extraReducers: (builder) => {
    builder
      // Get video comments
      .addCase(getVideoComments.pending, (state, action) => {
        const { parentId } = action.meta.arg;
        if (parentId) {
          // This is for replies
          state.isGettingReplies[parentId] = true;
        } else {
          // This is for top-level comments
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        const { data, parentId } = action.payload;
        // Handle both direct response and nested data structure
        const responseData = data?.data || data;

        if (parentId) {
          // This is for replies
          if (!state.replies[parentId]) {
            state.replies[parentId] = [];
          }

          // If this is a pagination request (page > 1), append to existing replies
          const existingReplies = state.replies[parentId];
          const newReplies = responseData?.docs || responseData || [];

          if (responseData?.page > 1) {
            // Append new replies to existing ones
            state.replies[parentId] = [...existingReplies, ...newReplies];
          } else {
            // Replace existing replies
            state.replies[parentId] = newReplies;
          }

          state.isGettingReplies[parentId] = false;

          if (!state.replyPagination[parentId]) {
            state.replyPagination[parentId] = {};
          }
          state.replyPagination[parentId] = {
            totalDocs: responseData?.totalDocs || 0,
            limit: responseData?.limit || 10,
            page: responseData?.page || 1,
            totalPages: responseData?.totalPages || 1,
            hasNextPage: responseData?.hasNextPage || false,
            hasPrevPage: responseData?.hasPrevPage || false,
          };

          // Update the parent comment's reply count in top-level comments
          const parentComment = state.comments.find(
            (comment) => comment._id === parentId
          );
          if (parentComment) {
            parentComment.replyCount =
              responseData?.totalDocs || state.replies[parentId].length;
          }
        } else {
          // This is for top-level comments
          state.comments = responseData?.docs || responseData || [];
          state.pagination = {
            totalDocs: responseData?.totalDocs || 0,
            limit: responseData?.limit || 10,
            page: responseData?.page || 1,
            totalPages: responseData?.totalPages || 1,
            hasNextPage: responseData?.hasNextPage || false,
            hasPrevPage: responseData?.hasPrevPage || false,
          };
          state.isLoading = false;
        }
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        const { parentId } = action.meta.arg;
        if (parentId) {
          state.isGettingReplies[parentId] = false;
        } else {
          state.isLoading = false;
        }
        state.error = action.payload;
      })
      // Get comment replies
      .addCase(getCommentReplies.pending, (state, action) => {
        const { commentId } = action.meta.arg;
        state.isGettingReplies[commentId] = true;
        state.error = null;
      })
      .addCase(getCommentReplies.fulfilled, (state, action) => {
        const { commentId, data } = action.payload;
        const responseData = data?.data || data;

        if (!state.replies[commentId]) {
          state.replies[commentId] = [];
        }

        // If this is a pagination request (page > 1), append to existing replies
        const existingReplies = state.replies[commentId];
        const newReplies = responseData?.docs || responseData || [];

        if (responseData?.page > 1) {
          // Append new replies to existing ones
          state.replies[commentId] = [...existingReplies, ...newReplies];
        } else {
          // Replace existing replies
          state.replies[commentId] = newReplies;
        }

        state.isGettingReplies[commentId] = false;

        if (!state.replyPagination[commentId]) {
          state.replyPagination[commentId] = {};
        }
        state.replyPagination[commentId] = {
          totalDocs: responseData?.totalDocs || 0,
          limit: responseData?.limit || 10,
          page: responseData?.page || 1,
          totalPages: responseData?.totalPages || 1,
          hasNextPage: responseData?.hasNextPage || false,
          hasPrevPage: responseData?.hasPrevPage || false,
        };

        // Update the parent comment's reply count in top-level comments
        const parentComment = state.comments.find(
          (comment) => comment._id === commentId
        );
        if (parentComment) {
          parentComment.replyCount =
            responseData?.totalDocs || state.replies[commentId].length;
        }
      })
      .addCase(getCommentReplies.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        state.isGettingReplies[commentId] = false;
        state.error = action.payload;
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isAdding = false;
        const { data, parentId } = action.payload;
        // Handle both direct response and nested data structure
        const commentData = data?.data || data;
        if (commentData) {
          if (parentId) {
            // This is a reply
            if (!state.replies[parentId]) {
              state.replies[parentId] = [];
            }
            state.replies[parentId].unshift(commentData);

            if (!state.replyPagination[parentId]) {
              state.replyPagination[parentId] = { ...initialState.pagination };
            }
            state.replyPagination[parentId].totalDocs += 1;

            // Update the parent comment's reply count in top-level comments
            const parentComment = state.comments.find(
              (comment) => comment._id === parentId
            );
            if (parentComment) {
              parentComment.replyCount = (parentComment.replyCount || 0) + 1;
            }
          } else {
            // This is a top-level comment
            state.comments.unshift(commentData);
            state.pagination.totalDocs += 1;
          }
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload;
      })
      // Update comment
      .addCase(updateComment.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Handle both direct response and nested data structure
        const commentData = action.payload?.data || action.payload;
        if (commentData) {
          // Update in top-level comments
          const topLevelIndex = state.comments.findIndex(
            (comment) => comment._id === commentData._id
          );
          if (topLevelIndex !== -1) {
            state.comments[topLevelIndex] = {
              ...state.comments[topLevelIndex],
              ...commentData,
            };
          }

          // Update in replies
          Object.keys(state.replies).forEach((commentId) => {
            const replyIndex = state.replies[commentId].findIndex(
              (reply) => reply._id === commentData._id
            );
            if (replyIndex !== -1) {
              state.replies[commentId][replyIndex] = {
                ...state.replies[commentId][replyIndex],
                ...commentData,
              };
            }
          });
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Delete comment
      .addCase(deleteComment.pending, (state, action) => {
        state.isDeleting[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        // Clear the deletion state for this comment
        delete state.isDeleting[commentId];

        // Remove from top-level comments
        const deletedComment = state.comments.find(
          (comment) => comment._id === commentId
        );
        if (deletedComment) {
          state.comments = state.comments.filter(
            (comment) => comment._id !== commentId
          );
          state.pagination.totalDocs = Math.max(
            0,
            state.pagination.totalDocs - 1
          );
        }

        // Remove from replies and handle cascading deletes
        Object.keys(state.replies).forEach((parentId) => {
          // Check if this parent comment was deleted
          if (parentId === commentId) {
            // Delete all replies under this comment
            const replyCount = state.replies[parentId]?.length || 0;
            delete state.replies[parentId];
            delete state.replyPagination[parentId];
            delete state.isGettingReplies[parentId];

            // Update parent comment's reply count if it exists in top-level comments
            const parentComment = state.comments.find(
              (comment) => comment._id === parentId
            );
            if (parentComment) {
              parentComment.replyCount = Math.max(
                0,
                parentComment.replyCount - replyCount
              );
            }
          } else {
            // Remove this specific reply from the parent's replies
            const replyIndex = state.replies[parentId].findIndex(
              (reply) => reply._id === commentId
            );
            if (replyIndex !== -1) {
              state.replies[parentId].splice(replyIndex, 1);

              // Update the parent comment's reply count
              if (state.replyPagination[parentId]) {
                state.replyPagination[parentId].totalDocs = Math.max(
                  0,
                  state.replyPagination[parentId].totalDocs - 1
                );
              }

              // Also update the replyCount in the parent comment if it exists in top-level comments
              const parentComment = state.comments.find(
                (comment) => comment._id === parentId
              );
              if (parentComment) {
                parentComment.replyCount = Math.max(
                  0,
                  parentComment.replyCount - 1
                );
              }
            }
          }
        });

        // Also check if the deleted comment was a reply to any other comment
        // and remove it from that comment's replies array
        Object.keys(state.replies).forEach((parentId) => {
          const replyIndex = state.replies[parentId].findIndex(
            (reply) => reply._id === commentId
          );
          if (replyIndex !== -1) {
            state.replies[parentId].splice(replyIndex, 1);
            if (state.replyPagination[parentId]) {
              state.replyPagination[parentId].totalDocs = Math.max(
                0,
                state.replyPagination[parentId].totalDocs - 1
              );
            }

            // Update the parent comment's reply count
            const parentComment = state.comments.find(
              (comment) => comment._id === parentId
            );
            if (parentComment) {
              parentComment.replyCount = Math.max(
                0,
                parentComment.replyCount - 1
              );
            }
          }
        });
      })
      .addCase(deleteComment.rejected, (state, action) => {
        const commentId = action.meta.arg;
        state.isDeleting[commentId] = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearComments,
  setCommentPage,
  setReplyPage,
  clearReplies,
  initializeCommentLikeState,
} = commentSlice.actions;

// Memoized selectors with stable references
export const selectComments = (state) => state.comment.comments;
export const selectReplies = (state, commentId) =>
  state.comment.replies[commentId] || [];
export const selectCommentPagination = (state) => state.comment.pagination;
export const selectReplyPagination = (state, commentId) =>
  state.comment.replyPagination[commentId] || { ...initialState.pagination };
export const selectIsCommentLoading = (state) => state.comment.isLoading;
export const selectIsAddingComment = (state) => state.comment.isAdding;
export const selectIsUpdatingComment = (state) => state.comment.isUpdating;
export const selectIsDeletingComment = (state, commentId) =>
  state.comment.isDeleting[commentId] || false;
export const selectIsGettingReplies = (state, commentId) =>
  state.comment.isGettingReplies[commentId] || false;
export const selectCommentError = (state) => state.comment.error;

export default commentSlice.reducer;
