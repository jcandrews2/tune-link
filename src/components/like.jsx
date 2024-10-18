import React, { useState, useEffect } from "react";
import LikeIcon from "../images/like.png";
import useStore from "../store";
import { saveTrack, checkRecommendations } from "../utils/profile-utils";

function Like() {
  const { profile, setProfile, spotifyPlayer, setSpotifyPlayer, token } =
    useStore();

  useEffect(() => {}, [profile, spotifyPlayer, token]);

  async function handleLike() {
    await saveTrack(true, profile, setProfile, spotifyPlayer, setSpotifyPlayer);
  }

  return (
    <div className="Like-container" onClick={handleLike}>
      <img
        src={LikeIcon}
        alt="Like"
        className="w-[2.25rem] h-auto transform active:scale-95"
      ></img>
    </div>
  );
}

export default Like;
