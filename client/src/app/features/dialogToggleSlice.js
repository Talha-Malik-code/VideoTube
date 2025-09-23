import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthDialogOpen: false,
  isUploadVideoDialogOpen: false,
  isCreatePlaylistDialogOpen: false,
};

const dialogToggleSlice = createSlice({
  name: "dialogToggle",
  initialState,
  reducers: {
    openDialog: (state, action) => {
      if (action.payload === "auth") {
        state.isAuthDialogOpen = true;
      } else if (action.payload === "uploadVideo") {
        state.isUploadVideoDialogOpen = true;
      } else if (action.payload === "createPlaylist") {
        state.isCreatePlaylistDialogOpen = true;
      }
    },
    closeDialog: (state, action) => {
      if (action.payload === "auth") {
        state.isAuthDialogOpen = false;
      } else if (action.payload === "uploadVideo") {
        state.isUploadVideoDialogOpen = false;
      } else if (action.payload === "createPlaylist") {
        state.isCreatePlaylistDialogOpen = false;
      }
    },
  },
});

export const selectIsAuthDialogOpen = (state) =>
  state.dialogToggle.isAuthDialogOpen;
export const selectIsUploadVideoDialogOpen = (state) =>
  state.dialogToggle.isUploadVideoDialogOpen;
export const selectIsCreatePlaylistDialogOpen = (state) =>
  state.dialogToggle.isCreatePlaylistDialogOpen;
export const selectAllDialogState = (state) => state.dialogToggle;

export const { openDialog, closeDialog } = dialogToggleSlice.actions;
export default dialogToggleSlice.reducer;
