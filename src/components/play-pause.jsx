import React from "react";
import PauseIcon from "../images/pause.png";
import PlayIcon from "../images/play.png";
import useStore from "../store";

function PlayPause() {
  const { spotifyPlayer } = useStore();
  function togglePlayback() {
    if (spotifyPlayer.isPaused) {
      resume();
    } else {
      pause();
    }
  }

  function pause() {
    spotifyPlayer.player.pause().then(() => {
      console.log("Paused track!");
    });
  }

  function resume() {
    spotifyPlayer.player.resume().then(() => {
      console.log("Resumed track!");
    });
  }

  return (
    <div className="p-2" onClick={togglePlayback}>
      {!spotifyPlayer.isPaused ? (
        <img
          src={PauseIcon}
          alt="Pause"
          className="w-[3.75rem] h-auto transform active:scale-95"
        />
      ) : (
        <img
          src={PlayIcon}
          alt="Play"
          className="w-[3.75rem] h-auto transform active:scale-95"
        />
      )}
    </div>
  );
}

export default PlayPause;
