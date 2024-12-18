import React, { useEffect } from "react";
import useStore from "../store";

function TrackInfo() {
  const { spotifyPlayer } = useStore();

  return (
    <div className="relative p-[0.64rem] z-10">
      <h2 className="text-xl font-bold text-white">
        {spotifyPlayer.currentTrack.name}
      </h2>
      <h3 className="font-light text-gray-300">
        {spotifyPlayer.currentTrack.artists[0].name}
      </h3>
    </div>
  );
}

export default TrackInfo;
