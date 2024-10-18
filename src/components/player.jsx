import React, { useEffect } from "react";
import PlayPause from "./play-pause";
import Like from "./like";
import Dislike from "./dislike";
import Cover from "./cover";
import TrackInfo from "./track-info";
import Loading from "./loading";
import Slider from "./slider";
import TrackTime from "./track-time";
import useStore from "../store";
import { transferSpotifyPlayback } from "../utils/spotify-utils";

function Player() {
  const { token, profile, spotifyPlayer, setSpotifyPlayer } = useStore();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (window.player) {
        window.player.disconnect();
      }
      const player = new window.Spotify.Player({
        name: "tune link",
        getOAuthToken: (cb) => {
          cb(token.value);
        },
        volume: 0.5,
      });

      setSpotifyPlayer({ player: player });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID:", device_id);
        transferSpotifyPlayback(token, device_id);
        setSpotifyPlayer({ deviceID: device_id });
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline:", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setSpotifyPlayer({
          currentTrack: state.track_window.current_track,
          isPaused: state.paused,
        });

        player.getCurrentState().then((state) => {
          !state
            ? setSpotifyPlayer({ isActive: false })
            : setSpotifyPlayer({ isActive: true });
        });
      });

      player.connect();
    };
  }, []);

  return (
    <>
      {spotifyPlayer.areRecommendationsLoading &&
      profile.recommendedSongs.length === 1 ? (
        <Loading />
      ) : (
        <>
          <Cover />
          {spotifyPlayer.currentTrack && <TrackInfo />}
          <div className="flex flex-col items-center p-[0.64rem]">
            <Slider />
            <TrackTime />
          </div>
        </>
      )}
      <div className="z-0 flex items-center justify-center select-none">
        <Dislike />
        <PlayPause />
        <Like />
      </div>
    </>
  );
}

export default Player;
