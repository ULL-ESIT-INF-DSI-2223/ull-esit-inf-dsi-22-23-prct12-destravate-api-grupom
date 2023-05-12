import { Track } from "../../models/trackModel.js";

/**
 * Manejador de la petición GET /tracks
 * Se debe dar el id por query
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getTrackQuery = async (req: any, res: any) => {
  const filter = req.query.id ? { id: req.query.id.toString() } : {};

  try {
    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.status(200).send(tracks);
    }
    return res.status(404).send({msg: "Usuario no encontrado"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al buscar un usuario", error});
  }
};

/**
 * Manejador de la petición GET /tracks
 * Se debe dar el id por params
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const getTrack = async (req: any, res: any) => {
  try {
    const filter = req.params.id ? { id: req.params.id.toString() } : {};

    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.status(200).send(tracks);
    }
    return res.status(404).send({msg: "Usuario no encontrado"});
  } catch (error) {
    return res.status(500).send({msg: "Fallo en el servidor al buscar un usuario", error});
  }
};