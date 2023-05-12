import { Track } from "../../models/trackModel.js";
import { Challenge } from "../../models/challengeModel.js";

/**
 * Manejador de la petición DELETE /tracks
 * Se debe pasar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteTrack = async (req: any, res: any) => {
  if (!req.params.id) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const track = await Track.findOne({ id: req.params.id.toString()});

    if (!track) {
      return res.status(404).send();
    }

    // ACTUALIZA: Se encarga de mantener sincronizados retos y las rutas
    await Challenge.updateMany({ tracks: track._id }, { $pull: { tracks: track._id }});

    await Track.findByIdAndDelete(track._id);
    return res.send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
};


/**
 * Manejador de la petición DELETE /tracks
 * Se debe pasar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const deleteTrackQuery = async (req: any, res: any) => {
  if (!req.query.id) {
    return res.status(400).send({ error: 'A username must be provided' });
  }

  try {
    const track = await Track.findOne({ id: req.query.id.toString()});

    if (!track) {
      return res.status(404).send();
    }

    // ACTUALIZA: Se encarga de mantener sincronizados retos y las rutas
    await Challenge.updateMany({ tracks: track._id }, { $pull: { tracks: track._id }});

    await Track.findByIdAndDelete(track._id);
    return res.send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
};
