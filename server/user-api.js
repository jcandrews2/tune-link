import { Router } from "express";

import {
  getProfile,
  likeSong,
  dislikeSong,
  createProfile,
  getRecommendations,
} from "./profile-controller.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const handlePutLiked = async (req, res) => {
  try {
    const userID = req.params.userID;
    const likedSong = req.body.song;

    await likeSong(userID, likedSong);
    return res
      .status(200)
      .json({ message: "Song successfully liked!", userID });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const handlePutDisliked = async (req, res) => {
  try {
    const userID = req.params.userID;
    const dislikedSong = req.body.song;
    await dislikeSong(userID, dislikedSong);
    return res
      .status(200)
      .json({ message: "Song successfully disliked!", userID, dislikedSong });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const handleGetProfile = async (req, res) => {
  try {
    const userID = req.params.userID;
    const profile = await getProfile(userID);
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const handleCreateProfile = async (req, res) => {
  try {
    const profileFields = req.body.profile;
    const profile = await createProfile(profileFields);
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const handleGetRecommendations = async (req, res) => {
  try {
    const userID = req.params.userID;
    const recommendations = await getRecommendations(userID);

    return res.status(200).json({ recommendations });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

router.route("/:userID").get(handleGetProfile).post(handleCreateProfile);

router.route("/:userID/liked").put(handlePutLiked);

router.route("/:userID/disliked").put(handlePutDisliked);

router.route("/:userID/recommendations").get(handleGetRecommendations);

export default router;
