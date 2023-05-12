import { Track } from "../../models/trackModel.js";

/**
 * Manejador de la petición POST /tracks
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const postTrack = async (req: any, res: any) => {
  try {
    const track = new Track(req.body);
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
};


