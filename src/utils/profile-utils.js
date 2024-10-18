import { playSpotifyTrack } from "./spotify-utils.js";

async function getRecommendations(profile) {
  const response = await fetch(
    `http://localhost:5050/user/${profile.userID}/recommendations`
  );
  if (response.ok) {
    const data = await response.json();

    return data;
  }
  throw new Error("Error fetching recommendations.");
}

async function handleLike(song, newRecommendedSongs, profile, setProfile) {
  const newLikedSongs = [
    ...profile.likedSongs,
    {
      songID: song.id,
      name: song.name,
      artist: song.artist,
    },
  ];
  setProfile({
    likedSongs: newLikedSongs,
    recommendedSongs: newRecommendedSongs,
  });

  const response = await fetch(
    `http://localhost:5050/user/${profile.userID}/liked`,
    {
      method: "PUT",
      body: JSON.stringify({ song: song }),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (response.ok) {
    console.log("Liked track!");
  }
}

async function handleDislike(song, newRecommendedSongs, profile, setProfile) {
  const newDislikedSongs = [
    ...profile.dislikedSongs,
    {
      songID: song.id,
      name: song.name,
      artist: song.artist,
    },
  ];
  setProfile({
    dislikedSongs: newDislikedSongs,
    recommendedSongs: newRecommendedSongs,
  });

  const response = await fetch(
    `http://localhost:5050/user/${profile.userID}/disliked`,
    {
      method: "PUT",
      body: JSON.stringify({ song: song }),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (response.ok) {
    console.log("Disliked track!");
  }
}

export async function saveTrack(
  isLiked,
  profile,
  setProfile,
  spotifyPlayer,
  setSpotifyPlayer
) {
  if (!profile.recommendedSongs || profile.recommendedSongs.length === 0)
    return;

  const song = profile.recommendedSongs[0];

  const newRecommendedSongs = profile.recommendedSongs.slice(1);

  console.log("Saving track:", song, newRecommendedSongs);

  if (isLiked) {
    await handleLike(song, newRecommendedSongs, profile, setProfile);
  } else {
    await handleDislike(song, newRecommendedSongs, profile, setProfile);
  }
  playSpotifyTrack(newRecommendedSongs[0].songID, spotifyPlayer, profile.token);

  checkRecommendations(profile, setProfile, spotifyPlayer, setSpotifyPlayer);
}

export async function checkRecommendations(
  profile,
  setProfile,
  spotifyPlayer,
  setSpotifyPlayer
) {
  // Get recommendations if needed
  if (
    !spotifyPlayer.areRecommendationsLoading &&
    profile.recommendedSongs.length < 5
  ) {
    setSpotifyPlayer({ areRecommendationsLoading: true });
    const newRecs = await getRecommendations(profile);
    setProfile({ recommendedSongs: newRecs.recommendations });
    setSpotifyPlayer({ areRecommendationsLoading: false });
  }
}
