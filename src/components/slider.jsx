import React, { useState, useEffect, useRef } from "react";
import useStore from "../store";

function Slider() {
  const { spotifyPlayer, setSpotifyPlayer, token } = useStore();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const slider = useRef(null);

  async function setTrackPosition(position) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      if (response.ok) {
        console.log("Set track position!");
      }
    } catch (error) {
      console.error("Error setting track position", error);
    }
  }

  function setBackground(value, min, max) {
    const backgroundValue = ((value - min) / (max - min)) * 100;
    if (slider.current) {
      slider.current.style.background = `linear-gradient(to right, white 0%, white ${backgroundValue}%, darkslategrey ${backgroundValue}%, darkslategrey 100%)`;
    }
  }

  function handleInput(event) {
    const value = parseFloat(event.target.value);
    setProgress(value);

    if (!spotifyPlayer.isPaused && !isDragging) {
      const position = Math.round(
        (value / 100) * spotifyPlayer.currentTrack.duration_ms
      );
      setTrackPosition(position);
    }
  }

  function handleMouseDown() {
    setIsDragging(true);
  }

  function handleMouseUp() {
    setIsDragging(false);

    const position = Math.round(
      (progress / 100) * spotifyPlayer.currentTrack.duration_ms
    );
    setTrackPosition(position);
  }

  useEffect(() => {
    if (!spotifyPlayer.currentTrack) {
      return;
    }
    setProgress(0);
  }, [spotifyPlayer.currentTrack?.id]);

  function incrementSlider() {
    if (!isDragging) {
      const increment = 100 / (spotifyPlayer.currentTrack.duration_ms / 1000);
      setProgress((prev) => Math.min(prev + increment, 100));
    }
  }

  useEffect(() => {
    if (progress === 100) {
      setProgress(0);
    }
    setBackground(progress, 0, 100);

    if (!spotifyPlayer.currentTrack) {
      return;
    }

    const position =
      (progress / 100) * (spotifyPlayer.currentTrack.duration_ms / 1000);
    setSpotifyPlayer({ position: position });
  }, [progress]);

  useEffect(() => {
    let interval;
    if (!spotifyPlayer.isPaused) {
      interval = setInterval(() => {
        incrementSlider();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [spotifyPlayer.isPaused, spotifyPlayer.currentTrack?.id]);

  return (
    <>
      <input
        ref={slider}
        type="range"
        step="0.01"
        min="0"
        max="100"
        value={progress}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onChange={handleInput}
      />
    </>
  );
}

export default Slider;
