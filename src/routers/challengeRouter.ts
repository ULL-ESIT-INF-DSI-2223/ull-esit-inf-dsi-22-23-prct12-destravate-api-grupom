import express from 'express';
import { Challenge } from '../models/challengeModel.js';

export const challengeRouter = express.Router();



challengeRouter.post('/challenges', async (req, res) => {
  const challenge = new Challenge(req.body);

  try {
    await challenge.save();
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }

});