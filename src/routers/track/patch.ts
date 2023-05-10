import { Track } from "../../models/trackModel.js";


export const patchTrackQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const allowedUpdates = ["name", "startGeolocation", "endGeolocation", "distance", "unevenness", "activity", "averageRating"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const track = await Track.findOneAndUpdate({ id: req.query.id }, req.body, { new: true, runValidators: true });

    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
};


export const patchTrack = async (req: any, res: any) => {
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
};