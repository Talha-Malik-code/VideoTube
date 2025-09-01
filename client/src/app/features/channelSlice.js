import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData } from "../../utils";

const initialState = {
  channelData: {
    _id: null,
    username: "",
    fullName: "",
    email: "",
    avatar: "",
    coverImage: "",
    videos: [],
    subscribersCount: 0,
    channelSubscribedToCount: 0,
    isSubscribed: false,
  },
  channelVideos: {
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
  channelVideosLoading: false,
  channelVideosError: null,
  loading: false,
  error: null,
  isSubscribing: false,
};

export const getChannelData = createAsyncThunk(
  "video/getChannelData",
  async (username, { rejectWithValue }) => {
    try {
      const data = await fetchData(`users/c/${username}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getChannelVideos = createAsyncThunk(
  "video/getChannelVideos",
  async (
    { channelId, query = { page: 1, limit: 10 } } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = { userId: channelId, ...query };
      const paramsString = new URLSearchParams(params).toString();
      const data = await fetchData(`videos?${paramsString}`);
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

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    cleanChannelData: (state) => {
      state.channelData = {
        _id: null,
        username: "",
        fullName: "",
        email: "",
        avatar: "",
        coverImage: "",
        videos: [],
        subscribersCount: 0,
        channelSubscribedToCount: 0,
        isSubscribed: false,
      };
      state.channelVideos = {
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
      };
      state.channelVideosLoading = false;
      state.channelVideosError = null;
      state.loading = false;
      state.error = null;
    },
    addUploadedVideo: (state, action) => {
      state.channelData.videos.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChannelData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChannelData.fulfilled, (state, action) => {
        state.channelData = action.payload;
        state.loading = false;
      })
      .addCase(getChannelData.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(getChannelVideos.pending, (state) => {
        state.channelVideosLoading = true;
      })
      .addCase(getChannelVideos.fulfilled, (state, action) => {
        state.channelVideos = action.payload;
        state.channelVideosLoading = false;
      })
      .addCase(getChannelVideos.rejected, (state, action) => {
        state.channelVideosError = action.payload || action.error.message;
        state.channelVideosLoading = false;
      })
      .addCase(toggleSubscription.pending, (state) => {
        state.isSubscribing = true;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isSubscribing = false;
        state.error = null;
        state.channelData.isSubscribed = action.payload.isSubscribed;
        state.channelData.subscribersCount = action.payload.subscriberCount;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.isSubscribing = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { cleanChannelData, addUploadedVideo } = channelSlice.actions;

export const selectChannelData = (state) => state.channel.channelData;
export const selectIsLoading = (state) => state.channel.loading;
export const selectChannelVideosLoading = (state) =>
  state.channel.channelVideosLoading;
export const selectChannelVideosError = (state) =>
  state.channel.channelVideosError;
export const selectIsSubscribing = (state) => state.channel.isSubscribing;
export const selectChannelVideos = (state) => state.channel.channelVideos;
export const selectError = (state) => state.channel.error;

export default channelSlice.reducer;
