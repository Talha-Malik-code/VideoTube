import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData } from "../../utils";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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
    isNotFetched: true,
  },

  channelVideosLoading: false,
  channelVideosError: null,
  loading: false,
  error: null,
  isSubscribing: false,

  cache: {
    channelData: {}, // { username: { data, timestamp } }
    channelVideos: {}, // { channelId: { data, timestamp, queryKey } }
  },
};

export const getChannelData = createAsyncThunk(
  "video/getChannelData",
  async (username, { getState, rejectWithValue }) => {
    try {
      const { cache } = getState().channel;
      const cached = cache.channelData[username];

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, username, fromApi: false };
      }

      const data = await fetchData(`users/c/${username}`);
      return { data, username, fromApi: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getChannelVideos = createAsyncThunk(
  "video/getChannelVideos",
  async (
    { channelId, query = { page: 1, limit: 10 } } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const { cache } = getState().channel;
      const queryKey = JSON.stringify(query);
      const cacheKey = `${channelId}-${queryKey}`;
      const cached = cache.channelVideos[cacheKey];

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, cacheKey, fromApi: false };
      }

      const params = { userId: channelId, ...query };
      const paramsString = new URLSearchParams(params).toString();
      const data = await fetchData(`videos?${paramsString}`);
      return { data, cacheKey, fromApi: true };
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
      state.channelData = initialState.channelData;
      state.channelVideos = initialState.channelVideos;
      state.channelVideosLoading = false;
      state.channelVideosError = null;
      state.loading = false;
      state.error = null;
      state.cache = initialState.cache;
    },
    addUploadedVideo: (state, action) => {
      state.channelData.videos.push(action.payload);
    },
    updateCachedChannelAvatar: (state, action) => {
      const { username, avatar } = action.payload;
      // Update channelData if cached
      if (state.cache.channelData[username]) {
        state.cache.channelData[username].data.avatar = avatar;
        state.cache.channelData[username].timestamp = Date.now();
      }
      // Also update current channelData if it’s the same user
      if (state.channelData.username === username) {
        state.channelData.avatar = avatar;
      }
    },
    updateCachedChannelCoverImage: (state, action) => {
      const { username, coverImage } = action.payload;

      if (state.cache.channelData[username]) {
        state.cache.channelData[username].data.coverImage = coverImage;
        state.cache.channelData[username].timestamp = Date.now();
      }

      if (state.channelData.username === username) {
        state.channelData.coverImage = coverImage;
      }
    },
    updateCachedChannelProfileInfo: (state, action) => {
      const { username, profileInfo } = action.payload;
      if (state.cache.channelData[username]) {
        state.cache.channelData[username].data.fullName = profileInfo.fullName;
        state.cache.channelData[username].data.email = profileInfo.email;
        state.cache.channelData[username].timestamp = Date.now();
      }

      if (state.channelData.username === username) {
        state.channelData.fullName = profileInfo.fullName;
        state.channelData.email = profileInfo.email;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChannelData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChannelData.fulfilled, (state, action) => {
        const { data, username, fromApi } = action.payload;
        console.log("getChannelData.fulfilled", data, username, fromApi);

        state.channelData = data;
        state.loading = false;
        state.error = null;

        if (fromApi) {
          state.cache.channelData[username] = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(getChannelData.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
      })
      .addCase(getChannelVideos.pending, (state) => {
        state.channelVideosLoading = true;
      })
      .addCase(getChannelVideos.fulfilled, (state, action) => {
        const { data, cacheKey, fromApi } = action.payload;

        state.channelVideos = data;
        state.channelVideosLoading = false;
        state.channelVideosError = null;

        if (fromApi) {
          state.cache.channelVideos[cacheKey] = {
            data,
            timestamp: Date.now(),
          };
        }
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

export const {
  cleanChannelData,
  addUploadedVideo,
  updateCachedChannelAvatar,
  updateCachedChannelCoverImage,
  updateCachedChannelProfileInfo,
} = channelSlice.actions;

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
