import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../../utils";

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

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
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
      });
  },
});

export const selectPlaylist = (state) => state.playlist.playlistData;
export const selectIsLoading = (state) => state.playlist.isLoading;
export const selectError = (state) => state.playlist.error;

export default playlistSlice.reducer;
