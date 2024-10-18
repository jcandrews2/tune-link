import OpenAI from "openai";

const openai = new OpenAI();

export async function getGPTResponse(content, model) {
  const response = await openai.chat.completions.create({
    model: model,
    messages: [{ role: "user", content: content }],
  });

  const message = response.choices[0].message.content;
  return message;
}

export async function searchSpotifyID(track, artist, token) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(
        track
      )}%20artist:${encodeURIComponent(artist)}&type=track&limit=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!data.tracks.items[0]) {
      return null;
    }

    return data.tracks.items[0].id;
  } catch (error) {
    console.error("Error searching Spotify ID.", error);
  }
}

export async function fetchRecommendations(profile) {
  const likedSongs = profile.likedSongs
    .map((song) => `${song.name} by ${song.artist}`)
    .join(", ");

  const dislikedSongs = profile.dislikedSongs
    .map((song) => `${song.name} by ${song.artist}`)
    .join(", ");

  const startingPrompt =
    "Act as a music recommender and give me exactly ten song recommendations. Your responses should not include anything but the names of the songs that you're recommending and the artists. The song names and artists should be separated by 'by'. Your responses should be split by commas. Do not number the songs, do not include any markdown, and do not use quotation marks.";

  const prompt = `Act as a music recommender and give me exactly five song recommendations that are similar to these liked songs ${likedSongs}. The songs that you recommend should not be in either of these lists: ${dislikedSongs}, ${likedSongs}. Your responses should not include anything but the names of the songs that you're recommending and the artists. The song names and artists should be separated by 'by'. Your responses should be split by commas. Do not number the songs, do not include any markdown, and do not use quotation marks.`;

  const output = await getGPTResponse(
    likedSongs.length === 0 ? startingPrompt : prompt,
    "gpt-4o"
  );

  const outputList = output.split(", ");

  let newRecs = outputList.map((song) => {
    const [name, artist] = song.split(" by ");
    return {
      songID: null,
      name: name,
      artist: artist,
    };
  });

  for (const rec of newRecs) {
    rec.songID = await searchSpotifyID(
      rec.name,
      rec.artist,
      profile.token.value
    );
  }

  // filter out recommended songs ... a lot
  newRecs = newRecs.filter((rec) => rec.songID !== null);

  // newRecs = newRecs.filter(
  //   (rec) => !profile.likedSongs.some((liked) => liked.songID === rec.songID)
  // );

  // newRecs = newRecs.filter(
  //   (rec) =>
  //     !profile.dislikedSongs.some((disliked) => disliked.songID === rec.songID)
  // );

  // newRecs = newRecs.filter(
  //   (rec) =>
  //     !profile.recommendedSongs.some(
  //       (recommended) => recommended.songID === rec.songID
  //     )
  // );

  const uniqueRecsMap = new Map(newRecs.map((rec) => [rec.songID, rec]));
  const uniqueRecs = Array.from(uniqueRecsMap.values());

  return uniqueRecs;
}
