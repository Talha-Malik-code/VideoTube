import React from "react";
import FileIcon from "../iconComponents/FileIcon";

const PlaylistNotFound = ({
  title = "No playlist created",
  text = "There are no playlist created on this channel.",
}) => {
  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <p className="mb-3 w-full">
          <span className="inline-flex rounded-full bg-[#E4D3FF] p-2 text-[#AE7AFF]">
            <span className="inline-block w-6">
              <FileIcon />
            </span>
          </span>
        </p>
        <h5 className="mb-2 font-semibold">{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default PlaylistNotFound;
