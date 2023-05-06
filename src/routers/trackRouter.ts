import express from 'express';
import { Track } from '../models/trackModel.js';

export const trackRouter = express.Router();


trackRouter.post('/tracks', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }

});