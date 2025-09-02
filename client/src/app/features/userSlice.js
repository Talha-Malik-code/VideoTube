import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData, updateWithFormData } from "../../utils";

const initialState = {
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed',
  isLoggedIn: false,
  isUpdatingAvatar: false,
  isUpdatingCover: false,
  isUpdatingProfileInfo: false,
  userData: null,
  error: null,
  imageUploadError: null,
};

export const registerUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData("users/register", formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await updateData("users/login", credentials, "POST");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Login failed. Check credentials."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await updateData("users/logout", {}, "POST");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const updateAvatarImage = createAsyncThunk(
  "user/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData(
        "users/avatar",
        formData,
        {
          credentials: "include",
        },
        "PATCH"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update avatar");
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  "user/updateCoverImage",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await updateWithFormData(
        "users/cover-image",
        formData,
        {
          credentials: "include",
        },
        "PATCH"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update cover");
    }
  }
);

export const updateProfileInfo = createAsyncThunk(
  "user/updateProfileInfo",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await updateData(
        "users/update-account",
        profileData,
        "PATCH"
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile info");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchData("users/current-user");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to check auth status");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.isLoggedIn = false;
        state.userData = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.error = action.payload || action.error.message;
        state.userData = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.isLoggedIn = false;
        state.userData = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
        state.isLoggedIn = !!action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.isLoggedIn = false;
        state.userData = null;
      })
      .addCase(updateAvatarImage.pending, (state) => {
        state.isUpdatingAvatar = true;
      })
      .addCase(updateAvatarImage.fulfilled, (state, action) => {
        state.isUpdatingAvatar = false;
        state.imageUploadError = null;
        // Update user avatar in the state
        if (state.userData && action.payload.avatar) {
          state.userData = { ...state.userData, avatar: action.payload.avatar };
        }
      })
      .addCase(updateAvatarImage.rejected, (state, action) => {
        state.isUpdatingAvatar = false;
        state.imageUploadError = action.payload || action.error.message;
      })
      .addCase(updateCoverImage.pending, (state) => {
        state.isUpdatingCover = true;
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.isUpdatingCover = false;
        state.imageUploadError = null;
        // Update user cover iage in the state
        if (state.userData && action.payload.coverImage) {
          state.userData = {
            ...state.userData,
            coverImage: action.payload.coverImage,
          };
        }
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.isUpdatingCover = false;
        state.imageUploadError = action.payload || action.error.message;
      })
      .addCase(updateProfileInfo.pending, (state) => {
        state.isUpdatingProfileInfo = true;
      })
      .addCase(updateProfileInfo.fulfilled, (state, action) => {
        state.isUpdatingProfileInfo = false;
        state.userData = action.payload;
      })
      .addCase(updateProfileInfo.rejected, (state, action) => {
        state.isUpdatingProfileInfo = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearUser } = userSlice.actions;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectUserData = (state) => state.user.userData;
export const selectError = (state) => state.user.error;
export const selectIsUpdatingAvatar = (state) => state.user.isUpdatingAvatar;
export const selectImageUploadError = (state) => state.user.imageUploadError;
export const selectIsUpdatingCover = (state) => state.user.isUpdatingCover;
export const selectIsUpdatingProfileInfo = (state) =>
  state.user.isUpdatingProfileInfo;

export default userSlice.reducer;
