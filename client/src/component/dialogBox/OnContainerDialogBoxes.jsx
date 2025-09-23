import React from "react";
import UploadVideoDialogBox from "./onContainerDialogBoxes/UploadVideoDialogBox";
import CreatePlaylistDialogBox from "./onContainerDialogBoxes/CreatePlaylistDialogBox";
import { useSelector } from "react-redux";
import {
  selectIsUploadVideoDialogOpen,
  selectIsCreatePlaylistDialogOpen,
} from "../../app/features/dialogToggleSlice";
import UploadingVideoDialogBox from "./onContainerDialogBoxes/UploadingVideoDialogBox";
import CreatingPlaylistDialogBox from "./onContainerDialogBoxes/CreatingPlaylistDialogBox";

const OnContainerDialogBoxes = () => {
  const isUploadVideoDialogOpen = useSelector(selectIsUploadVideoDialogOpen);
  const isCreatePlaylistDialogOpen = useSelector(
    selectIsCreatePlaylistDialogOpen
  );

  return (
    <>
      {isUploadVideoDialogOpen && <UploadVideoDialogBox />}
      {isCreatePlaylistDialogOpen && <CreatePlaylistDialogBox />}
      {/* <UploadingVideoDialogBox /> */}
    </>
  );
};

export default OnContainerDialogBoxes;
