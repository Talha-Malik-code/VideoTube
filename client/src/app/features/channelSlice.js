import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData, updateWithFormData } from "../../utils";

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
  subscribedChannels: {
    subscribedChannels: [],
    subscribedCount: 0,
    isNotFetched: true,
  },
  channelPlaylists: [],

  channelPlaylistsLoading: false,
  channelPlaylistsError: null,
  isCreatingChannelPlaylist: false,
  channelVideosLoading: false,
  channelVideosError: null,
  subscribedChannelsLoading: false,
  subscribedChannelsError: null,
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
    subscribedChannels: {}, // { channelId: { data, timestamp } }
    channelPlaylists: {}, // { channelId: { data, timestamp } }
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

export const getSubscribedChannels = createAsyncThunk(
  "channel/getSubscribedChannels",
  async (channelId, { getState, rejectWithValue }) => {
    try {
      const { cache } = getState().channel;
      const cached = cache.subscribedChannels[channelId];

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, cacheKey: channelId, fromApi: false };
      }

      const data = await fetchData(`sub/u/${channelId}`);
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
      return { ...data, id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getChannelPlaylists = createAsyncThunk(
  "channel/getChannelPlaylists",
  async (channelId, { getState, rejectWithValue }) => {
    try {
      const { cache } = getState().channel;
      const cached = cache.channelPlaylists[channelId];

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, cacheKey: channelId, fromApi: false };
      }

      const data = await fetchData(`playlist/user/${channelId}`);
      return { data, cacheKey: channelId, fromApi: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChannelPlaylist = createAsyncThunk(
  "channel/createChannelPlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      console.log(...playlistData);
      const data = await updateWithFormData("playlist", playlistData);
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
      state.channelPlaylists = initialState.channelPlaylists;
      state.channelPlaylistsLoading = false;
      state.channelPlaylistsError = null;
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
      const uploadedVideo = action.payload;
      // Always keep channelData.videos in sync if present
      if (state.channelData && Array.isArray(state.channelData.videos)) {
        state.channelData.videos.push(uploadedVideo);
      }

      // Determine uploaded video's owner id from common shapes
      const ownerId =
        uploadedVideo?.owner?._id ||
        uploadedVideo?.owner?.id ||
        uploadedVideo?.ownerId ||
        uploadedVideo?.userId ||
        null;

      // Only mutate channelVideos and cache if the currently open channel matches the uploaded video's owner
      if (!ownerId || state.channelData?._id !== ownerId) {
        return;
      }

      // Update in-memory channelVideos list shown on the channel page
      if (state.channelVideos && Array.isArray(state.channelVideos.docs)) {
        // Insert at the top similar to most-recent-first lists
        state.channelVideos.docs.unshift(uploadedVideo);
        if (state.channelVideos.pagination) {
          const pagination = state.channelVideos.pagination;
          if (typeof pagination.totalDocs === "number") {
            pagination.totalDocs += 1;
          }
          // If you maintain other pagination fields, you may want to recalc here
        }
      }

      // Update any cached entries for this channel's videos
      // Cache keys look like: `${channelId}-${JSON.stringify(query)}`
      if (state.cache && state.cache.channelVideos) {
        const cacheKeys = Object.keys(state.cache.channelVideos);
        for (const key of cacheKeys) {
          if (!key.startsWith(`${ownerId}-`)) continue;

          const cachedEntry = state.cache.channelVideos[key];
          if (!cachedEntry || !cachedEntry.data) continue;

          const data = cachedEntry.data;
          if (Array.isArray(data.docs)) {
            // Only prepend to page 1 caches if pagination info exists and page === 1, else skip
            const pageNumber = data.pagination?.page;
            if (!pageNumber || pageNumber === 1) {
              data.docs.unshift(uploadedVideo);
              if (
                data.pagination &&
                typeof data.pagination.totalDocs === "number"
              ) {
                data.pagination.totalDocs += 1;
              }
              // Refresh timestamp as cache mutated
              cachedEntry.timestamp = Date.now();
            }
          }
        }
      }
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
    updateIsSubscribedInSubscribedChannels: (state, action) => {
      const { channelUsername, isSubscribed } = action.payload;
      const currentChannelId = state.channelData._id;

      // Update the main state
      const channelToUpdate = state.subscribedChannels.subscribedChannels.find(
        (channel) => channel.subscribedChannel.username === channelUsername
      );

      if (channelToUpdate) {
        channelToUpdate.subscribedChannel.subscribed = isSubscribed;
      }

      // Update the cache
      if (state.cache.subscribedChannels[currentChannelId]) {
        state.cache.subscribedChannels[
          currentChannelId
        ].data.subscribedChannels = state.cache.subscribedChannels[
          currentChannelId
        ].data.subscribedChannels.map((channel) => {
          if (channel.subscribedChannel.username === channelUsername) {
            return {
              ...channel,
              subscribedChannel: {
                ...channel.subscribedChannel,
                subscribed: isSubscribed,
              },
            };
          }
          return channel;
        });
        state.cache.subscribedChannels[currentChannelId].timestamp = Date.now();
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
      .addCase(getSubscribedChannels.pending, (state) => {
        state.subscribedChannelsLoading = true;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        const { data, cacheKey, fromApi } = action.payload;
        // Handle the backend response structure: { subscribedChannels: [...], subscribedCount: 1 }
        state.subscribedChannels.subscribedChannels =
          data.subscribedChannels || [];
        state.subscribedChannels.subscribedCount = data.subscribedCount || 0;
        state.subscribedChannelsLoading = false;
        state.subscribedChannelsError = null;
        state.error = null;
        if (fromApi) {
          state.cache.subscribedChannels[cacheKey] = {
            data: data, // Store only the data, not the entire action.payload
            timestamp: Date.now(),
          };
        }
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.subscribedChannelsError = action.payload || action.error.message;
        state.subscribedChannelsLoading = false;
      })
      .addCase(getChannelPlaylists.pending, (state) => {
        state.channelPlaylistsLoading = true;
      })
      .addCase(getChannelPlaylists.fulfilled, (state, action) => {
        const { data, cacheKey, fromApi } = action.payload;
        state.channelPlaylists = data;
        state.channelPlaylistsLoading = false;
        state.channelPlaylistsError = null;
        if (fromApi) {
          state.cache.channelPlaylists[cacheKey] = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(getChannelPlaylists.rejected, (state, action) => {
        state.channelPlaylistsError = action.payload || action.error.message;
        state.channelPlaylistsLoading = false;
      })
      .addCase(createChannelPlaylist.pending, (state) => {
        state.isCreatingChannelPlaylist = true;
        state.channelPlaylistsError = null;
      })
      .addCase(createChannelPlaylist.fulfilled, (state, action) => {
        state.isCreatingChannelPlaylist = false;
        state.channelPlaylistsError = null;
        state.channelPlaylists.push(action.payload);

        if (state.cache.channelPlaylists[action.payload.owner]) {
          state.cache.channelPlaylists[action.payload.owner].data.unshift(
            action.payload
          );
          state.cache.channelPlaylists[action.payload.owner].timestamp =
            Date.now();
        }
      })
      .addCase(createChannelPlaylist.rejected, (state, action) => {
        state.channelPlaylistsError = action.payload || action.error.message;
        state.isCreatingChannelPlaylist = false;
      })
      .addCase(toggleSubscription.pending, (state) => {
        state.isSubscribing = true;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isSubscribing = false;
        state.error = null;
        if (action.payload.id === state.channelData._id) {
          state.channelData.isSubscribed = action.payload.isSubscribed;
          state.channelData.subscribersCount = action.payload.subscriberCount;
        }
        console.log("toggleSubscription.fulfilled", action.payload);

        if (state.cache.channelData[action.payload.id]) {
          state.cache.channelData[action.payload.id].data.isSubscribed =
            action.payload.isSubscribed;
          state.cache.channelData[action.payload.id].data.subscribersCount =
            action.payload.subscriberCount;
          state.cache.channelData[action.payload.id].timestamp = Date.now();
        }
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
  updateIsSubscribedInSubscribedChannels,
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
export const selectSubscribedChannels = (state) =>
  state.channel.subscribedChannels;
export const selectSubscribedChannelsLoading = (state) =>
  state.channel.subscribedChannelsLoading;
export const selectSubscribedChannelsError = (state) =>
  state.channel.subscribedChannelsError;
export const selectChannelPlaylists = (state) => state.channel.channelPlaylists;
export const selectChannelPlaylistsLoading = (state) =>
  state.channel.channelPlaylistsLoading;
export const selectChannelPlaylistsError = (state) =>
  state.channel.channelPlaylistsError;
export const selectIsCreatingChannelPlaylist = (state) =>
  state.channel.isCreatingChannelPlaylist;

export default channelSlice.reducer;
