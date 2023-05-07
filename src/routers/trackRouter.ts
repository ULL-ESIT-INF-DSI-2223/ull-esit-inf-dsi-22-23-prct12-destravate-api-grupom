import express from "express";
import { Track } from "../models/trackModel.js";
import { Challenge } from "../models/challengeModel.js";

export const trackRouter = express.Router();

/////////////////////////////////// POST  ///////////////////////////////////////

trackRouter.post("/tracks", async (req, res) => {
  const track = new Track(req.body);

  try {
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
  const filter = req.params.id ? { id: req.params.id.toString() } : {};

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

/////////////////////////////////// PATCH  ///////////////////////////////////////


trackRouter.patch("/tracks/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "startGeolocation", "endGeolocation", "distance", "unevenness", "users", "activity", "averageRating"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: "Los parámetros seleccionados no se puede modificar",
      });
    }

    const track = await Track.findOneAndUpdate(
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
    const track = await Track.findOne({
      id: req.params.id
    });

    if (!track) {
      return res.status(404).send({
        error: "Ruta no encontrada"
      });
    }



    const vector = await Challenge.find({ tracks: { $in: [track._id] } });

    
    // for(let i = 0; i < vector.length; i++) {
    //   let pepe = await Challenge.findOneAndUpdate(
    //     {
    //       id: vector[i]._id,
    //     },
    //     {tracks: pepe.tracks.filter((track) => track._id !== track._id)},
    //     {
    //       new: true,
    //       runValidators: true,
    //     }
    //   );
    // }
          

    ///
    // const challenge = await Challenge.findOneAndUpdate(
    //   {
    //     tracks: track._id,
    //   },
    //   {tracks: []}},
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // )

    ///

    // const tracka = await Track.findByIdAndDelete(track._id);
    // return res.send(user);
    // // const tracka = await Track.findOneAndDelete({ id: req.params.id })
    
    // if (tracka) {
    //   return res.send(tracka);
    // }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});