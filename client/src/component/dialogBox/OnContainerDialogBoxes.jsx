import React from "react";
import UploadVideoDialogBox from "./onContainerDialogBoxes/UploadVideoDialogBox";
import { useSelector } from "react-redux";
import { selectIsUploadVideoDialogOpen } from "../../app/features/dialogToggleSlice";
import UploadingVideoDialogBox from "./onContainerDialogBoxes/UploadingVideoDialogBox";

const OnContainerDialogBoxes = () => {
  const isUploadVideoDialogOpen = useSelector(selectIsUploadVideoDialogOpen);

  return (
    <>
      {isUploadVideoDialogOpen && <UploadVideoDialogBox />}
      {/* <UploadingVideoDialogBox /> */}
    </>
  );
};

export default OnContainerDialogBoxes;
