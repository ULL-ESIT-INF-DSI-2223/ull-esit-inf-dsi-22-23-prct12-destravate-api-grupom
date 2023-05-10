import { Track } from "../../models/trackModel.js";

export const getTrackQuery = async (req: any, res: any) => {
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
};

export const getTrack = async (req: any, res: any) => {
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
};