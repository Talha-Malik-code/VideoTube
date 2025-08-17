import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import videoReducer from "../features/videoSlice";
import dialogToggleReducer from "../features/dialogToggleSlice";
import commentReducer from "../features/commentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
    dialogToggle: dialogToggleReducer,
    comment: commentReducer,
  },
});

export default store;
