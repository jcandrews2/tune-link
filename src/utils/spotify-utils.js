export async function playSpotifyTrack(trackID, spotifyPlayer, token) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${spotifyPlayer.deviceID}`,
      {
        method: "PUT",
        body: JSON.stringify({
          uris: [`spotify:track:${trackID}`],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    if (response.ok) {
      console.log("Successfully played track!");
    }
  } catch (error) {
    console.error("Error playing the song:", error);
  }
}

export async function transferSpotifyPlayback(token, deviceID) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      body: JSON.stringify({
        device_ids: [deviceID],
        play: false,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (response.ok) {
      console.log("Playback successfully transferred to the device:", deviceID);
    }
  } catch (error) {
    console.error("Error transferring playback:", error);
  }
}
