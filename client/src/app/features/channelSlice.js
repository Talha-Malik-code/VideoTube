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
  loading: false,
  error: null,
  isSubscribing: false,
};

export const getUserVideos = createAsyncThunk(
  "video/getUserVideos",
  async (username, { rejectWithValue }) => {
    try {
      const data = await fetchData(`users/c/${username}`);
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
      state.loading = false;
      state.error = null;
    },
    addUploadedVideo: (state, action) => {
      state.channelData.videos.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserVideos.fulfilled, (state, action) => {
        state.channelData = action.payload;
        state.loading = false;
      })
      .addCase(getUserVideos.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.loading = false;
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
export const selectIsSubscribing = (state) => state.channel.isSubscribing;

export default channelSlice.reducer;
