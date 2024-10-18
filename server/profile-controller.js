import Profile from "./profile-model.js";
import { fetchRecommendations } from "./chatgpt-client.js";

export async function createProfile(profileFields) {
  const profile = new Profile();
  profile.userID = profileFields.userID;
  profile.profilePicture = profileFields.profilePicture
    ? profileFields.profilePicture.url
    : null;
  profile.token = profileFields.token;
  profile.likedSongs = profileFields.likedSongs;
  profile.dislikedSongs = profileFields.dislikedSongs;
  profile.recommendedSongs = profileFields.recommendedSongs;
  try {
    const newRecs = await fetchRecommendations(profile);
    profile.recommendedSongs = profile.recommendedSongs.concat(newRecs);
    profile.markModified("recommendedSongs");
    await profile.save();
    return profile;
  } catch (error) {
    throw new Error(`Create profile error: ${error}`);
  }
}

export async function getProfile(userID) {
  const profile = await Profile.findOne({ userID: userID });
  if (!profile) throw new Error("Profile not found.");
  return profile;
}

export async function updateProfile(userID, profileFields) {
  const updatedProfile = await Profile.findOneAndUpdate(
    { userID: userID },
    profileFields,
    { new: true }
  );
  if (!updatedProfile) throw new Error("Profile not found");
  return updatedProfile;
}

export async function deleteProfile(userID) {
  const result = await Profile.findOneAndDelete({ userID });
  if (!result) throw new Error("Profile not found");
}

export async function likeSong(userID, song) {
  const profile = await getProfile(userID);
  profile.likedSongs.push({
    songID: song.id,
    name: song.name,
    artist: song.artist,
  });

  profile.recommendedSongs.shift();

  await updateProfile(userID, profile);
}

export async function dislikeSong(userID, song) {
  const profile = await getProfile(userID);
  profile.dislikedSongs.push({
    songID: song.id,
    name: song.name,
    artist: song.artist,
  });

  profile.recommendedSongs.shift();

  await updateProfile(userID, profile);
}

export async function getRecommendations(userID) {
  const profile = await getProfile(userID);
  const newRecs = await fetchRecommendations(profile);
  profile.recommendedSongs = profile.recommendedSongs.concat(newRecs);

  await updateProfile(userID, profile);

  return profile.recommendedSongs;
}
