import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData, updateWithFormData } from "../../utils";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const initialState = {
  playlistData: {
    _id: null,
    name: "",
    description: "",
    videos: [],
    owner: {},
    isNotFetched: true,
  },
  error: null,
  isLoading: false,
  cache: {},
};

export const getPlaylist = createAsyncThunk(
  "playlist/getPlaylist",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { cache } = getState().playlist;
      const cached = cache[id];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { data: cached.data, cacheKey: id, fromApi: false };
      }

      const data = await fetchData(`playlist/${id}`);
      return { data: data[0], cacheKey: id, fromApi: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePlaylistDetails = createAsyncThunk(
  "playlist/updatePlaylistDetails",
  async ({ playlistId, name, description, thumbnail }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (name !== undefined) formData.append("name", name);
      if (description !== undefined)
        formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      const data = await updateWithFormData(
        `playlist/${playlistId}`,
        formData,
        { credentials: "include" },
        "PATCH"
      );
      // Controller returns ApiResponse with aggregated array in data
      return data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeVideoFromPlaylistThunk = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const data = await updateData(
        `playlist/remove/${videoId}/${playlistId}`,
        {},
        "PATCH"
      );
      return { playlistId, videoId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    updateCachedOwnerAvatar: (state, action) => {
      const { userId, newAvatar } = action.payload;
      console.log("new avatar", newAvatar);

      // Update current playlistData if the owner matches
      if (state.playlistData?.owner?._id === userId) {
        state.playlistData.owner.avatar = newAvatar;
      }

      // Update all cached playlists
      Object.keys(state.cache).forEach((cacheKey) => {
        const cacheEntry = state.cache[cacheKey];
        console.log("cacheEntry", cacheEntry);
        if (cacheEntry?.data) {
          // Update playlist owner avatar
          if (cacheEntry.data.owner?._id === userId) {
            cacheEntry.data.owner.avatar = newAvatar;
            cacheEntry.timestamp = Date.now();
          }

          // Update video owners in playlist videos array
          if (Array.isArray(cacheEntry.data.videos)) {
            let videosUpdated = false;
            cacheEntry.data.videos = cacheEntry.data.videos.map((video) => {
              if (video.owner?._id === userId) {
                videosUpdated = true;
                return {
                  ...video,
                  owner: {
                    ...video.owner,
                    avatar: newAvatar,
                  },
                };
              }
              return video;
            });

            if (videosUpdated) {
              cacheEntry.timestamp = Date.now();
            }
          }
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlaylist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlaylist.fulfilled, (state, action) => {
        const { data, cacheKey, fromApi } = action.payload;
        state.playlistData = data;
        state.isLoading = false;
        state.error = null;
        if (fromApi) {
          state.cache[cacheKey] = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(getPlaylist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.isLoading = false;
      })
      .addCase(updatePlaylistDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePlaylistDetails.fulfilled, (state, action) => {
        // Backend returns updated playlist document
        const updated = action.payload;
        state.playlistData = {
          ...state.playlistData,
          ...updated,
        };
        // Update cache entry if present
        const cacheKey = state.playlistData?._id;
        if (cacheKey && state.cache[cacheKey]) {
          state.cache[cacheKey] = {
            data: state.playlistData,
            timestamp: Date.now(),
          };
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updatePlaylistDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeVideoFromPlaylistThunk.fulfilled, (state, action) => {
        const { videoId } = action.payload;
        if (Array.isArray(state.playlistData.videos)) {
          state.playlistData.videos = state.playlistData.videos.filter(
            (v) => (v._id || v) !== videoId
          );
        }
        const cacheKey = state.playlistData?._id;
        if (cacheKey && state.cache[cacheKey]) {
          state.cache[cacheKey].data.videos = state.playlistData.videos;
          state.cache[cacheKey].timestamp = Date.now();
        }
      });
  },
});

export const { updateCachedOwnerAvatar } = playlistSlice.actions;

export const selectPlaylist = (state) => state.playlist.playlistData;
export const selectIsLoading = (state) => state.playlist.isLoading;
export const selectError = (state) => state.playlist.error;

export default playlistSlice.reducer;
