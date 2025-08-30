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
  lastUploadedVideo: null,
  subscriberCount: 0,
  isSubscribed: false,

  isLoading: false,
  isUploading: false,
  isUpdating: false,
  isDeleting: false,
  isSubscribing: false,

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
      return rejectWithValue(error.message || "Failed to upload video");
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
      return rejectWithValue(error.message || "Failed to fetch videos");
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
      return rejectWithValue(error.message || "Failed to fetch video");
    }
  }
);

export const updateVideo = createAsyncThunk(
  "video/updateVideo",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData(
        `videos/${id}`,
        formData,
        {
          credentials: "include",
        },
        "PATCH"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update video");
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
      return rejectWithValue(error.message || "Failed to delete video");
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
      return rejectWithValue(
        error.message || "Failed to toggle publish status"
      );
    }
  }
);

export const updateVideoThumbnail = createAsyncThunk(
  "video/updateVideoThumbnail",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData(`videos/t/${id}`, formData, {
        credentials: "include",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update thumbnail");
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
      return rejectWithValue(
        error.message || "Failed to fetch recommended videos"
      );
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
      return rejectWithValue(error.message || "Failed to toggle subscription");
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
      state.isSubscribed = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.lastUploadedVideo = action.payload;
        state.isUploading = false;
        state.uploadError = null;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.lastUploadedVideo = null;
        state.isUploading = false;
        state.uploadError = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
      })
      .addCase(getVideoById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videoDetails = action.payload;
        state.currentVideo = action.payload;
        state.subscriberCount = action.payload?.owner?.subscribersCount;
        state.isSubscribed = action.payload?.owner?.isSubscribed;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
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
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCurrentVideo } = videoSlice.actions;

export const selectAllVideos = (state) => state.video.allVideos;
export const selectVideoDetails = (state) => state.video.videoDetails;
export const selectUserVideos = (state) => state.video.userVideos;
export const selectCurrentVideo = (state) => state.video.currentVideo;
export const selectLastUploadedVideo = (state) => state.video.lastUploadedVideo;
export const selectIsLoading = (state) => state.video.isLoading;
export const selectIsUploading = (state) => state.video.isUploading;
export const selectIsUpdating = (state) => state.video.isUpdating;
export const selectIsDeleting = (state) => state.video.isDeleting;
export const selectError = (state) => state.video.error;
export const selectUploadError = (state) => state.video.uploadError;
export const selectIsSubscribed = (state) => state.video.isSubscribed;
export const selectIsSubscribing = (state) => state.video.isSubscribing;
export const selectSubscriberCount = (state) => state.video.subscriberCount;

export default videoSlice.reducer;
