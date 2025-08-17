import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import videoReducer from "../features/videoSlice";
import dialogToggleReducer from "../features/dialogToggleSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
    dialogToggle: dialogToggleReducer,
  },
});

export default store;
