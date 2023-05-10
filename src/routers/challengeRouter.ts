import express from 'express';

import { postChallenge } from "../routers/challenge/post.js";
import { getChallengeQuery, getChallenge } from "../routers/challenge/get.js";
import { patchChallengeQuery, patchChallenge } from "./challenge/patch.js";
import { deleteChallengeQuery, deleteChallenge } from "./challenge/delete.js";

export const challengeRouter = express.Router();

challengeRouter.post("/challenges", postChallenge)
challengeRouter.get("/challenges", getChallengeQuery)
challengeRouter.get("/challenges/:id", getChallenge)
challengeRouter.patch("/challenges", patchChallengeQuery)
challengeRouter.patch("/challenges/:id", patchChallenge)
challengeRouter.delete("/challenges", deleteChallengeQuery)
challengeRouter.delete("/challenges/:id", deleteChallenge)
