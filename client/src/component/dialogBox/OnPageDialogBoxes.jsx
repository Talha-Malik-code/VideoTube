import React from "react";
import AuthDialogBox from "./onPageDialogBoxes/authDialogBox";
import { useDispatch, useSelector } from "react-redux";
import {
  closeDialog,
  selectIsAuthDialogOpen,
} from "../../app/features/dialogToggleSlice";

const OnPageDialogBoxes = () => {
  const dispatch = useDispatch();
  const isAuthDialogOpen = useSelector(selectIsAuthDialogOpen);

  function handleCloseDialog() {
    dispatch(closeDialog("auth"));
  }

  return (
    <AuthDialogBox isOpen={isAuthDialogOpen} onClose={handleCloseDialog} />
  );
};

export default OnPageDialogBoxes;
