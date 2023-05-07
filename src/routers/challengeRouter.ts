import express from 'express';
import { Challenge } from '../models/challengeModel.js';

export const challengeRouter = express.Router();

/////////////////////////////////// POST  ///////////////////////////////////////

challengeRouter.post('/challenges', async (req, res) => {
  const challenge = new Challenge(req.body);

  try {
    await challenge.save();
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }

});


/////////////////////////////////// GET  ///////////////////////////////////////

challengeRouter.get('/challenges', async (req, res) => {
  const filter = req.query.id ? {id: req.query.id.toString()} : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

challengeRouter.get('/challenges/:id', async (req, res) => {
  const filter = req.params.id ? {id: req.params.id.toString()} : {};

  try {
    const challenges = await Challenge.find(filter);

    if (challenges.length !== 0) {
      return res.send(challenges);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// PATCH  ///////////////////////////////////////

challengeRouter.patch("/challenges/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "tracks", "activity", "totalDistance", "users"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: "Los parámetros seleccionados no se puede modificar",
      });
    }

    const challenge = await Challenge.findOneAndUpdate(
      {
        id: req.params.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    // TODO : revisar el populate
    if (challenge) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


/////////////////////////////////// DELETE  ///////////////////////////////////////
