import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData, updateWithFormData } from "../../utils";

const initialState = {
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  allVideos: {
    docs: [],
    pagination: {
      totalDocs: 0,
      limit: 10,
      page: 1,
      totalPages: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    },
  },
  userVideos: [],
  currentVideo: null,
  videoDetails: null,
  subscriberCount: 0,
  likeCount: 0,
  dislikeCount: 0,
  isSubscribed: false,
  isLiked: false,
  isDisliked: false,

  isLoading: false,
  isUploading: false,
  isUpdating: false,
  isDeleting: false,
  isSubscribing: false,
  isLiking: false,
  isDisliking: false,

  error: null,
  uploadError: null,
};

export const uploadVideo = createAsyncThunk(
  "video/uploadVideo",
  async (FormData, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData("videos/", FormData, {
        credentials: "include",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllVideos = createAsyncThunk(
  "video/getVideos",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchData("videos?page=1&limit=10");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getVideoById = createAsyncThunk(
  "video/getVideoById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchData(`videos/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData(`videos/${id}`, FormData, {
        methodType: "PATCH",
        credentials: "include",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "video/deleteVideo",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateData(`videos/${id}`, {}, "DELETE");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  "video/togglePublishStatus",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateData(`videos/toggle/publish/${id}`, {}, "PATCH");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVideoThumbnail = createAsyncThunk(
  "video/updateVideoThumbnail",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData(`videos/t/${id}`, FormData, {
        credentials: "include",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecommendedVideos = createAsyncThunk(
  "video/fetchRecommendedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchData("videos?page=1&limit=10");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSubscription = createAsyncThunk(
  "video/toggleSubscription",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateData(`sub/c/${id}`, {}, "POST");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "video/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateData(`like/toggle/v/${id}`, {}, "POST");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleDislike = createAsyncThunk(
  "video/toggleDislike",
  async (id, { rejectWithValue }) => {
    try {
      const data = await updateData(`dislike/toggle/v/${id}`, {}, "POST");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
      state.isLiked = false;
      state.isSubscribed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadVideo.fulfilled, (state) => {
        state.isUploading = false;
        state.uploadError = null;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isUpdating = false;
        state.uploadError = action.error.message;
      })
      .addCase(getAllVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allVideos = action.payload;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getVideoById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videoDetails = action.payload;
        state.currentVideo = action.payload;
        state.subscriberCount = action.payload.owner.subscribersCount;
        state.likeCount = action.payload.totalLikes;
        state.isSubscribed = action.payload.owner.isSubscribed;
        state.isLiked = action.payload.isLiked;
        state.dislikeCount = action.payload.totalDislikes;
        state.isDisliked = action.payload.isDisliked;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateVideo.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateVideo.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message;
      })
      .addCase(deleteVideo.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.isDeleting = false;
        state.error = null;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message;
      })
      .addCase(togglePublishStatus.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(togglePublishStatus.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message;
      })
      .addCase(updateVideoThumbnail.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateVideoThumbnail.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(updateVideoThumbnail.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecommendedVideos.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecommendedVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allVideos = action.payload;
      })
      .addCase(fetchRecommendedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleSubscription.pending, (state) => {
        state.isSubscribing = true;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isSubscribing = false;
        state.error = null;
        state.isSubscribed = action.payload.isSubscribed;
        state.subscriberCount = action.payload.subscriberCount;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.isSubscribing = false;
        state.error = action.error.message;
      })
      .addCase(toggleLike.pending, (state) => {
        state.isLiking = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.isLiking = false;
        state.error = null;
        state.isLiked = action.payload.isLiked;
        state.likeCount = action.payload.likeCount;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.isLiking = false;
        state.error = action.error.message;
      })
      .addCase(toggleDislike.pending, (state) => {
        state.isDisliking = true;
      })
      .addCase(toggleDislike.fulfilled, (state, action) => {
        state.isDisliking = false;
        state.error = null;
        state.isDisliked = action.payload.isDisliked;
        state.dislikeCount = action.payload.dislikeCount;
      })
      .addCase(toggleDislike.rejected, (state, action) => {
        state.isDisliking = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentVideo } = videoSlice.actions;

export const selectAllVideos = (state) => state.video.allVideos;
export const selectVideoDetails = (state) => state.video.videoDetails;
export const selectUserVideos = (state) => state.video.userVideos;
export const selectCurrentVideo = (state) => state.video.currentVideo;
export const selectIsLoading = (state) => state.video.isLoading;
export const selectIsUploading = (state) => state.video.isUploading;
export const selectIsUpdating = (state) => state.video.isUpdating;
export const selectIsDeleting = (state) => state.video.isDeleting;
export const selectError = (state) => state.video.error;
export const selectUploadError = (state) => state.video.uploadError;
export const selectIsSubscribed = (state) => state.video.isSubscribed;
export const selectIsSubscribing = (state) => state.video.isSubscribing;
export const selectIsLiked = (state) => state.video.isLiked;
export const selectIsLiking = (state) => state.video.isLiking;
export const selectSubscriberCount = (state) => state.video.subscriberCount;
export const selectLikeCount = (state) => state.video.likeCount;
export const selectDislikeCount = (state) => state.video.dislikeCount;
export const selectIsDisliked = (state) => state.video.isDisliked;
export const selectIsDisliking = (state) => state.video.isDisliking;

export default videoSlice.reducer;
