import express from "express";

import { postTrack } from "../routers/track/post.js";
import { getTrackQuery, getTrack } from "../routers/track/get.js";
import { patchTrackQuery, patchTrack } from "./track/patch.js";
import { deleteTrackQuery, deleteTrack } from "./track/delete.js";

export const trackRouter = express.Router();

trackRouter.post("/tracks", postTrack)
trackRouter.get("/tracks", getTrackQuery)
trackRouter.get("/tracks/:id", getTrack)
trackRouter.patch("/tracks", patchTrackQuery)
trackRouter.patch("/tracks/:id", patchTrack)
trackRouter.delete("/tracks", deleteTrackQuery)
trackRouter.delete("/tracks/:id", deleteTrack)
