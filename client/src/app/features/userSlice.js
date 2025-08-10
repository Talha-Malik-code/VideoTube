import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, updateData, updateWithFormData } from "../../utils";

const initialState = {
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed',
  isLoggedIn: false,
  userData: null,
  error: null,
};

export const registerUser = createAsyncThunk(
  "user/register",
  async (formData) => {
    const data = await updateWithFormData("users/register", formData);
    return data;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    const data = await updateData("users/login", credentials, "POST");
    if (!data) {
      return rejectWithValue("Login failed. Check credentials.");
    }
    return data;
  }
);

export const logoutUser = createAsyncThunk("user/logout", async () => {
  const data = await updateData("users/logout", {}, "POST");
  return data;
});

export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async () => {
    const data = await fetchData("users/current-user");
    return data;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
        state.isLoggedIn = false;
        state.userData = null;
      });
  },
});

export const { clearUser } = userSlice.actions;
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectUserData = (state) => state.user.userData;

export default userSlice.reducer;
