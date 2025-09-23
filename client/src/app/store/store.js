import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import videoReducer from "../features/videoSlice";
import dialogToggleReducer from "../features/dialogToggleSlice";
import commentReducer from "../features/commentSlice";
import likeReducer from "../features/likeSlice";
import dislikeReducer from "../features/dislikeSlice";
import channelReducer from "../features/channelSlice";
import playlistReducer from "../features/playlistSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    video: videoReducer,
    dialogToggle: dialogToggleReducer,
    comment: commentReducer,
    like: likeReducer,
    dislike: dislikeReducer,
    channel: channelReducer,
    playlist: playlistReducer,
  },
});

export default store;
