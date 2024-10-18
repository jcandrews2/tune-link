import React, { useEffect } from "react";
import DislikeIcon from "../images/dislike.png";
import useStore from "../store";
import { saveTrack } from "../utils/profile-utils";

function Dislike() {
  const { profile, setProfile, spotifyPlayer, setSpotifyPlayer, token } =
    useStore();

  useEffect(() => {}, [profile, spotifyPlayer, token]);

  async function handleDislike() {
    await saveTrack(
      false,
      profile,
      setProfile,
      spotifyPlayer,
      setSpotifyPlayer
    );
  }

  return (
    <div className="Dislike-container" onClick={handleDislike}>
      <img
        src={DislikeIcon}
        alt="Dislike"
        className="w-[2.25rem] h-auto transform active:scale-95"
      ></img>
    </div>
  );
}

export default Dislike;
