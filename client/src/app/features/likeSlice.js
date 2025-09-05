import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateData } from "../../utils";

const initialState = {
  videoLikes: {},
  commentLikes: {},
  tweetLikes: {},
  isLoading: false,
  isLiking: false,
  error: null,
};

// Default state objects to ensure stable references
const defaultLikeState = { isLiked: false, likeCount: 0 };
const defaultCommentLikeState = { isLiked: false, likeCount: 0 };
const defaultTweetLikeState = { isLiked: false, likeCount: 0 };

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const data = await updateData(`like/toggle/v/${videoId}`, {}, "POST");
      return { videoId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "like/toggleCommentLike",
  async (commentId, { rejectWithValue }) => {
    try {
      const data = await updateData(`like/toggle/c/${commentId}`, {}, "POST");
      return { commentId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "like/toggleTweetLike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const data = await updateData(`like/toggle/t/${tweetId}`, {}, "POST");
      return { tweetId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    clearVideoLikes: (state) => {
      state.videoLikes = {};
    },
    clearCommentLikes: (state) => {
      state.commentLikes = {};
    },
    clearTweetLikes: (state) => {
      state.tweetLikes = {};
    },
    setVideoLikeState: (state, action) => {
      const { videoId, isLiked, likeCount } = action.payload;
      state.videoLikes[videoId] = { isLiked, likeCount };
    },
    setCommentLikeState: (state, action) => {
      const { commentId, isLiked, likeCount } = action.payload;
      state.commentLikes[commentId] = { isLiked, likeCount };
    },
    initializeVideoLikeState: (state, action) => {
      const { videoId, isLiked, likeCount } = action.payload;
      if (!state.videoLikes[videoId]) {
        state.videoLikes[videoId] = { isLiked, likeCount };
      }
    },
    initializeCommentLikeState: (state, action) => {
      const { commentId, isLiked, likeCount } = action.payload;
      if (!state.commentLikes[commentId]) {
        state.commentLikes[commentId] = { isLiked, likeCount };
      }
    },
    initializeTweetLikeState: (state, action) => {
      const { tweetId, isLiked, likeCount } = action.payload;
      if (!state.tweetLikes[tweetId]) {
        state.tweetLikes[tweetId] = { isLiked, likeCount };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.isLiking = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.isLiking = false;
        const { videoId, data } = action.payload;
        state.videoLikes[videoId] = {
          isLiked: data.isLiked,
          likeCount: data.likeCount,
        };
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.isLiking = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(toggleCommentLike.pending, (state) => {
        state.isLiking = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.isLiking = false;
        // console.log("toggleCommentLike.fulfilled", action.payload);
        const { commentId, data } = action.payload;
        state.commentLikes[commentId] = {
          isLiked: data.isLiked,
          likeCount: data.likeCount,
        };
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.isLiking = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(toggleTweetLike.pending, (state) => {
        state.isLiking = true;
        state.error = null;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.isLiking = false;
        const { tweetId, data } = action.payload;
        state.tweetLikes[tweetId] = {
          isLiked: data.isLiked,
          likeCount: data.likeCount,
        };
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.isLiking = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearVideoLikes,
  clearCommentLikes,
  clearTweetLikes,
  setVideoLikeState,
  setCommentLikeState,
  initializeVideoLikeState,
  initializeCommentLikeState,
  initializeTweetLikeState,
} = likeSlice.actions;

// Memoized selectors with stable references
export const selectVideoLikeState = (state, videoId) => {
  const likeState = state.like.videoLikes[videoId];
  if (likeState) {
    return likeState;
  }
  return defaultLikeState;
};

export const selectCommentLikeState = (state, commentId) => {
  const likeState = state.like.commentLikes[commentId];
  if (likeState) {
    return likeState;
  }
  return defaultCommentLikeState;
};

export const selectTweetLikeState = (state, tweetId) => {
  const likeState = state.like.tweetLikes[tweetId];
  if (likeState) {
    return likeState;
  }
  return defaultTweetLikeState;
};

export const selectIsLiking = (state) => state.like.isLiking;
export const selectLikeError = (state) => state.like.error;

export default likeSlice.reducer;
