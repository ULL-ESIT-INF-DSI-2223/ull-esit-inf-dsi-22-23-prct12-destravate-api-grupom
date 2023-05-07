import express from 'express';
import { Group } from '../models/groupModel.js';

export const groupRouter = express.Router();

/////////////////////////////////// POST  ///////////////////////////////////////

groupRouter.post('/groups', async (req, res) => {
  const group = new Group(req.body);

  try {
    await group.save();
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }

});


/////////////////////////////////// GET  ///////////////////////////////////////

groupRouter.get('/groups', async (req, res) => {
  const filter = req.query.id ? {id: req.query.id.toString()} : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.send(groups);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

groupRouter.get('/groups/:id', async (req, res) => {
  const filter = req.params.id ? {id: req.params.id.toString()} : {};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.send(groups);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


/////////////////////////////////// PATCH  ///////////////////////////////////////

groupRouter.patch("/groups/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "participants", "groupTrainingStats", "groupRanking", "groupFavoriteTracks", "groupHistoricalTracks"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: "Los parámetros seleccionados no se puede modificar",
      });
    }

    const group = await Group.findOneAndUpdate(
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
    if (group) {
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// DELETE  ///////////////////////////////////////
