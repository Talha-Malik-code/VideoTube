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

  channelTweets: {
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
  channelTweetsLoading: false,
  channelTweetsError: null,
  isCreatingTweet: false,

  cache: {
    channelData: {}, // { username: { data, timestamp } }
    channelVideos: {}, // { channelId: { data, timestamp, queryKey } }
    channelTweets: {}, // { channelId: { data, timestamp } }
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
  "channel/getChannelVideos",
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

export const getChannelTweets = createAsyncThunk(
  "channel/getChannelTweets",
  async (channelId, { getState, rejectWithValue }) => {
    try {
      const { cache } = getState().channel;
      const cached = cache.channelTweets[channelId];

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, cacheKey: channelId, fromApi: false };
      }
      const data = await fetchData(`tweet/user/${channelId}`);
      return { data, cacheKey: channelId, fromApi: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChannelTweet = createAsyncThunk(
  "channel/createNewTweet",
  async (content, { rejectWithValue }) => {
    try {
      const data = await updateData("tweet", { content }, "POST");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSubscription = createAsyncThunk(
  "channel/toggleSubscription",
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
      state.channelTweets = initialState.channelTweets;
      state.isUpdatingChannelInfo = false;
      state.channelVideosLoading = false;
      state.channelVideosError = null;
      state.channelTweetsLoading = false;
      state.channelTweetsError = null;
      state.isCreatingTweet = false;
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
    updateCachedChannelChannelInfo: (state, action) => {
      const { username, newUsername } = action.payload;
      if (state.cache.channelData[username]) {
        state.cache.channelData[username].data.username = newUsername;
        state.cache.channelData[username].timestamp = Date.now();
      }

      if (state.channelData.username === username) {
        state.channelData.username = newUsername;
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
      .addCase(getChannelTweets.pending, (state) => {
        state.channelTweetsLoading = true;
      })
      .addCase(getChannelTweets.fulfilled, (state, action) => {
        const { data, cacheKey, fromApi } = action.payload;
        state.channelTweets = data;
        state.channelTweetsLoading = false;
        state.channelTweetsError = null;
        if (fromApi) {
          state.cache.channelTweets[cacheKey] = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(getChannelTweets.rejected, (state, action) => {
        state.channelTweetsError = action.payload || action.error.message;
        state.channelTweetsLoading = false;
      })
      .addCase(createChannelTweet.pending, (state) => {
        state.isCreatingTweet = true;
      })
      .addCase(createChannelTweet.fulfilled, (state, action) => {
        state.isCreatingTweet = false;
        state.error = null;
        const newTweet = {
          ...action.payload,
          likesCount: 0,
          dislikesCount: 0,
          isLiked: false,
          isDisliked: false,
        };

        state.channelTweets.docs.unshift(newTweet);

        if (state.cache.channelTweets[state.channelData._id]) {
          state.cache.channelTweets[state.channelData._id].data.docs.unshift(
            newTweet
          );
          state.cache.channelTweets[state.channelData._id].timestamp =
            Date.now();
        }
      })
      .addCase(createChannelTweet.rejected, (state, action) => {
        state.isCreatingTweet = false;
        state.error = action.payload || action.error.message;
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
  updateCachedChannelChannelInfo,
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
export const selectChannelTweetsLoading = (state) =>
  state.channel.channelTweetsLoading;
export const selectChannelTweetsError = (state) =>
  state.channel.channelTweetsError;
export const selectChannelTweets = (state) => state.channel.channelTweets;
export const selectIsCreatingTweet = (state) => state.channel.isCreatingTweet;

export default channelSlice.reducer;
