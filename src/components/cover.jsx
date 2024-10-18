import React, { useState } from "react";
import Loading from "./loading";
import useStore from "../store";
import ColorThief from "colorthief";

function Cover() {
  const { spotifyPlayer } = useStore();
  const colorThief = new ColorThief();
  const [dominantColor, setDominantColor] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  async function getDominantColor() {
    const img = document.querySelector('img[alt="Cover"]');
    img.crossOrigin = "Anonymous";

    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const color = await colorThief.getColor(img);
      const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      setDominantColor(rgbColor);
      setAnimationKey((prevKey) => prevKey + 1);
    }
  }

  return (
    <>
      <div className="relative w-[18.75rem] h-[18.75rem] left-1/2 -translate-x-1/2 p-[1.875rem] z-0 select-none">
        {spotifyPlayer.isActive ? (
          <>
            <img
              src={spotifyPlayer.currentTrack.album.images[0].url}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              alt="Cover"
              style={{ width: "300px", height: "300px" }}
              onLoad={getDominantColor}
            />
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-[25px] blur-[50px] fade-in"
              key={animationKey}
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: dominantColor,
              }}
            ></div>
          </>
        ) : (
          <Loading> </Loading>
        )}
      </div>
    </>
  );
}

export default Cover;
