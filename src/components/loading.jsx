import React from "react";
import LoadingIcon from "../images/loading.gif";

function Loading() {
  return (
    <div className="flex justify-center">
      <img
        src={LoadingIcon}
        alt="Loading"
        className="w-[2.25rem] h-auto select-none"
      ></img>
    </div>
  );
}

export default Loading;
