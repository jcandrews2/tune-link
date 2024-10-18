import { create } from "zustand";

const useStore = create((set) => ({
  profile: {
    userID: "",
    profilePicture: "",
    token: null,
    likedSongs: [],
    dislikedSongs: [],
    recommendedSongs: [],
  },
  setProfile: (updatedProfile) =>
    set((state) => ({
      profile: { ...state.profile, ...updatedProfile },
    })),

  token: {
    value: "",
    lastRefreshed: 0,
  },
  setToken: (updatedToken) => {
    set((state) => ({
      token: { ...state.token, ...updatedToken },
    }));
    set((state) => ({
      profile: { ...state.profile, token: updatedToken },
    }));
  },

  spotifyPlayer: {
    player: null,
    isActive: false,
    isPaused: true,
    currentTrack: null,
    position: 0,
    deviceID: null,
    areRecommendationsInitialized: false,
    areRecommendationsLoading: false,
  },
  setSpotifyPlayer: (updatedSpotifyPlayer) =>
    set((state) => ({
      spotifyPlayer: { ...state.spotifyPlayer, ...updatedSpotifyPlayer },
    })),
}));

export default useStore;
