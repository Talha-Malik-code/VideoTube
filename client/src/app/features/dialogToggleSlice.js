import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const dialogToggleSlice = createSlice({
  name: "dialogToggle",
  initialState,
  reducers: {
    openDialog: (state) => {
      state.isOpen = true;
    },
    closeDialog: (state) => {
      state.isOpen = false;
    },
  },
});

export const selectIsDialogOpen = (state) => state.dialogToggle.isOpen;

export const { openDialog, closeDialog } = dialogToggleSlice.actions;
export default dialogToggleSlice.reducer;
