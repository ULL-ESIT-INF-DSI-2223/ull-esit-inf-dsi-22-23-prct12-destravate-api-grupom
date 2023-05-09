import express from "express";
import { Track } from "../models/trackModel.js";
import { Challenge } from "../models/challengeModel.js";
import { User } from "../models/userModel.js";
import { Schema } from "mongoose";


export const trackRouter = express.Router();

/////////////////////////////////// POST  ///////////////////////////////////////

trackRouter.post("/tracks", async (req, res) => {
  try {
    const track = new Track(req.body);
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }    
});

/////////////////////////////////// GET  ///////////////////////////////////////

trackRouter.get("/tracks", async (req, res) => {
  const filter = req.query.id ? { id: req.query.id.toString() } : {};

  try {
    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.send(tracks);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.get("/tracks/:id", async (req, res) => {
  try {
    const filter = req.params.id ? { id: req.params.id.toString() } : {};

    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.send(tracks);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// PATCH  ///////////////////////////////////////


trackRouter.patch("/tracks/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "startGeolocation", "endGeolocation", "distance", "unevenness", "activity", "averageRating"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const track = await Track.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    // TODO : revisar el populate

    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// DELETE  ///////////////////////////////////////

trackRouter.delete('/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findOne({ id: req.params.id });

    if (!track) {
      return res.status(404).send({ error: "Ruta no encontrada" });
    }
    // const vector = await Challenge.find({ tracks: { $in: [track._id] } });

    await Track.findByIdAndDelete(track._id); // Borra el elemento de B
    

    // ACTUALIZA : actualiza el atributo tracks de los retos cuando una ruta es eliminada
    await Challenge.updateMany( { tracks: track._id }, { $pull: { tracks: track._id } });
 


    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});
