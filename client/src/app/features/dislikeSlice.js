import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateData } from "../../utils";

const initialState = {
  videoDislikes: {},
  commentDislikes: {},
  tweetDislikes: {},
  isLoading: false,
  isDisliking: false,
  error: null,
};

// Default state objects to ensure stable references
const defaultDislikeState = { isDisliked: false, dislikeCount: 0 };
const defaultCommentDislikeState = { isDisliked: false, dislikeCount: 0 };

export const toggleVideoDislike = createAsyncThunk(
  "dislike/toggleVideoDislike",
  async (videoId, { rejectWithValue }) => {
    try {
      const data = await updateData(`dislike/toggle/v/${videoId}`, {}, "POST");
      return { videoId, data };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to toggle video dislike");
    }
  }
);

export const toggleCommentDislike = createAsyncThunk(
  "dislike/toggleCommentDislike",
  async (commentId, { rejectWithValue }) => {
    try {
      const data = await updateData(
        `dislike/toggle/c/${commentId}`,
        {},
        "POST"
      );
      return { commentId, data };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to toggle comment dislike"
      );
    }
  }
);

export const toggleTweetDislike = createAsyncThunk(
  "dislike/toggleTweetDislike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const data = await updateData(`dislike/toggle/t/${tweetId}`, {}, "POST");
      return { tweetId, data };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to toggle tweet dislike");
    }
  }
);

const dislikeSlice = createSlice({
  name: "dislike",
  initialState,
  reducers: {
    clearVideoDislikes: (state) => {
      state.videoDislikes = {};
    },
    clearCommentDislikes: (state) => {
      state.commentDislikes = {};
    },
    clearTweetDislikes: (state) => {
      state.tweetDislikes = {};
    },
    setVideoDislikeState: (state, action) => {
      const { videoId, isDisliked, dislikeCount } = action.payload;
      state.videoDislikes[videoId] = { isDisliked, dislikeCount };
    },
    setCommentDislikeState: (state, action) => {
      const { commentId, isDisliked, dislikeCount } = action.payload;
      state.commentDislikes[commentId] = { isDisliked, dislikeCount };
    },
    initializeVideoDislikeState: (state, action) => {
      const { videoId, isDisliked, dislikeCount } = action.payload;
      if (!state.videoDislikes[videoId]) {
        state.videoDislikes[videoId] = { isDisliked, dislikeCount };
      }
    },
    initializeCommentDislikeState: (state, action) => {
      const { commentId, isDisliked, dislikeCount } = action.payload;
      if (!state.commentDislikes[commentId]) {
        state.commentDislikes[commentId] = { isDisliked, dislikeCount };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleVideoDislike.pending, (state) => {
        state.isDisliking = true;
        state.error = null;
      })
      .addCase(toggleVideoDislike.fulfilled, (state, action) => {
        state.isDisliking = false;
        const { videoId, data } = action.payload;
        state.videoDislikes[videoId] = {
          isDisliked: data.isDisliked,
          dislikeCount: data.dislikeCount,
        };
      })
      .addCase(toggleVideoDislike.rejected, (state, action) => {
        state.isDisliking = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(toggleCommentDislike.pending, (state) => {
        state.isDisliking = true;
        state.error = null;
      })
      .addCase(toggleCommentDislike.fulfilled, (state, action) => {
        state.isDisliking = false;
        const { commentId, data } = action.payload;
        state.commentDislikes[commentId] = {
          isDisliked: data.isDisliked,
          dislikeCount: data.dislikeCount,
        };
      })
      .addCase(toggleCommentDislike.rejected, (state, action) => {
        state.isDisliking = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(toggleTweetDislike.pending, (state) => {
        state.isDisliking = true;
        state.error = null;
      })
      .addCase(toggleTweetDislike.fulfilled, (state, action) => {
        state.isDisliking = false;
        const { tweetId, data } = action.payload;
        state.tweetDislikes[tweetId] = {
          isDisliked: data.isDisliked,
          dislikeCount: data.dislikeCount,
        };
      })
      .addCase(toggleTweetDislike.rejected, (state, action) => {
        state.isDisliking = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearVideoDislikes,
  clearCommentDislikes,
  clearTweetDislikes,
  setVideoDislikeState,
  setCommentDislikeState,
  initializeVideoDislikeState,
  initializeCommentDislikeState,
} = dislikeSlice.actions;

// Memoized selectors with stable references
export const selectVideoDislikeState = (state, videoId) => {
  const dislikeState = state.dislike.videoDislikes[videoId];
  if (dislikeState) {
    return dislikeState;
  }
  return defaultDislikeState;
};

export const selectCommentDislikeState = (state, commentId) => {
  const dislikeState = state.dislike.commentDislikes[commentId];
  if (dislikeState) {
    return dislikeState;
  }
  return defaultCommentDislikeState;
};

export const selectTweetDislikeState = (state, tweetId) => {
  const dislikeState = state.dislike.tweetDislikes[tweetId];
  if (dislikeState) {
    return dislikeState;
  }
  return defaultDislikeState;
};

export const selectIsDisliking = (state) => state.dislike.isDisliking;
export const selectDislikeError = (state) => state.dislike.error;

export default dislikeSlice.reducer;
