import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData } from "../../utils";

const initialState = {
  comments: [],
  pagination: {
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  isLoading: false,
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

export const getVideoComments = createAsyncThunk(
  "comment/getVideoComments",
  async ({ videoId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await fetchData(
        `comment/${videoId}?page=${page}&limit=${limit}`,
        {
          credentials: "include",
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comment/addComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const data = await updateData(`comment/${videoId}`, { content }, "POST");
      return data;
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
      state.pagination = initialState.pagination;
    },
    setCommentPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get video comments
      .addCase(getVideoComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle both direct response and nested data structure
        const responseData = action.payload?.data || action.payload;
        state.comments = responseData?.docs || responseData || [];
        state.pagination = {
          totalDocs: responseData?.totalDocs || 0,
          limit: responseData?.limit || 10,
          page: responseData?.page || 1,
          totalPages: responseData?.totalPages || 1,
          hasNextPage: responseData?.hasNextPage || false,
          hasPrevPage: responseData?.hasPrevPage || false,
        };
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isAdding = false;
        // Handle both direct response and nested data structure
        const commentData = action.payload?.data || action.payload;
        if (commentData) {
          state.comments.unshift(commentData);
          state.pagination.totalDocs += 1;
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
          const index = state.comments.findIndex(
            (comment) => comment._id === commentData._id
          );
          if (index !== -1) {
            state.comments[index] = commentData;
          }
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
        state.pagination.totalDocs = Math.max(
          0,
          state.pagination.totalDocs - 1
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments, setCommentPage } = commentSlice.actions;

// Selectors
export const selectComments = (state) => state.comment.comments;
export const selectCommentPagination = (state) => state.comment.pagination;
export const selectIsCommentLoading = (state) => state.comment.isLoading;
export const selectIsAddingComment = (state) => state.comment.isAdding;
export const selectIsUpdatingComment = (state) => state.comment.isUpdating;
export const selectIsDeletingComment = (state) => state.comment.isDeleting;
export const selectCommentError = (state) => state.comment.error;

export default commentSlice.reducer;
