import mongoose from "mongoose";

const token = {
  value: String,
  lastRefreshed: Number,
};

const songSchema = new mongoose.Schema({
  songID: String,
  name: String,
  artist: String,
});

const profileSchema = new mongoose.Schema({
  userID: String,
  profilePicture: String,
  token: token,
  likedSongs: [songSchema],
  dislikedSongs: [songSchema],
  recommendedSongs: [songSchema],
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
