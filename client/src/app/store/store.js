import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import videoReducer from "../features/videoSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
  },
});

export default store;
